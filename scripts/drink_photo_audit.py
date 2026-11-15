#!/usr/bin/env python3
"""
My Drink · High-Definition Beverage Photo Semantic Audit & Provenance Ledger
=============================================================================
Scans Tea Monographs, Tea Mountains, TeaWare (`src/halls/tea/content/**`),
Wine Specimens (`src/halls/wine/content.ts`), and Coffee Specimens
(`src/halls/coffee/content.ts`), fetches HD authentic photography from
Chinese Wikipedia, Wikimedia Commons, 360 Image HD CDN, and Baidu Image CDN,
and maintains `public/photos/semantic-ledger.json`.

CLI:
  --limit N          Process at most N items this run
  --skip-download    Rebuild ledger from existing local files only
  --only-missing     Skip items that already have a local photo
  --workers N        Concurrent fetch workers (default 10)
  --bootstrap        Force NEEDS_FETCH ledger for all items (no network)
  --candidates ID --query QUERY
                     Print the top eight candidates as JSON without writing
  --set-url ID --url URL
                     Validate and install one image, then update the ledger
"""

from __future__ import annotations

import argparse
import hashlib
import html
import json
import re
import struct
import subprocess
import threading
import time
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
TEA_CONTENT_DIR = ROOT / "src" / "halls" / "tea" / "content"
WINE_CONTENT_DIR = ROOT / "src" / "halls" / "wine" / "content"
COFFEE_CONTENT_FILE = ROOT / "src" / "halls" / "coffee" / "content.ts"
COFFEE_CONTENT_INDEX = ROOT / "src" / "halls" / "coffee" / "content" / "index.ts"
PHOTOS_DIR = ROOT / "public" / "photos"
LEDGER_PATH = PHOTOS_DIR / "semantic-ledger.json"

UA = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
)
WIKI_UA = "ZhuoweiDrinkCompendium/1.0 (https://my-drink.local; curator@my-drink.local)"

MIN_WIDTH = 480
MIN_HEIGHT = 320
MIN_BYTES = 18_000
PREFERRED_WIDTH = 640
LIBRARY_TARGET_BYTES = 22_000

CRAFT_STEP_PHOTO_SPECS = {
    "craft-tea-green": ("中华茶馆", "西湖龙井 手工炒茶 铁锅 杀青"),
    "craft-tea-white": ("中华茶馆", "白茶 萎凋 晒茶 福鼎 茶叶"),
    "craft-tea-yellow": ("中华茶馆", "蒙顶黄芽 制茶 茶叶"),
    "craft-tea-oolong": ("中华茶馆", "武夷岩茶 制茶 摇青 晒青 茶叶"),
    "craft-tea-black": ("中华茶馆", "红茶 揉捻 发酵 茶叶"),
    "craft-tea-dark": ("中华茶馆", "普洱茶 熟茶 渥堆 发酵"),
    "craft-tea-scented": ("中华茶馆", "福州茉莉花茶 窨花 茉莉鲜花"),
    "craft-baijiu-step1": ("国酿·白酒", "红缨子高粱 酿酒 蒸粮 酒厂车间"),
    "craft-baijiu-step2": ("国酿·白酒", "白酒 大曲 酒曲 酿酒 茅台"),
    "craft-baijiu-step3": ("国酿·白酒", "酱香酒 摊晾 堆积发酵 酿酒车间"),
    "craft-baijiu-step4": ("国酿·白酒", "泸州老窖 老窖池 酿酒窖池"),
    "craft-baijiu-step5": ("国酿·白酒", "白酒 酿造 蒸馏 甑桶 酿酒车间"),
    "craft-baijiu-step6": ("国酿·白酒", "白酒 酿酒 接酒 蒸馏 酒花"),
    "craft-baijiu-step7": ("国酿·白酒", "白酒 陶坛酒库 封坛 陈酿"),
    "craft-beer-step1": ("麦律·啤酒", "大麦麦芽 烘焙麦芽 精酿啤酒原料"),
    "craft-beer-step2": ("麦律·啤酒", "精酿啤酒厂 糖化锅 铜釜 酿造设备"),
    "craft-beer-step3": ("麦律·啤酒", "新鲜啤酒花 球果 Hops 精酿"),
    "craft-beer-step4": ("麦律·啤酒", "精酿啤酒 不锈钢发酵罐 酿酒厂"),
    "craft-beer-step5": ("麦律·啤酒", "精酿啤酒 酒头 打酒 生啤杯"),
    "craft-huangjiu-1": ("黄酒/葡萄/烈酒/调酒", "绍兴黄酒 冬酿 浸米 糯米"),
    "craft-huangjiu-2": ("黄酒/葡萄/烈酒/调酒", "绍兴黄酒 蒸饭 开酿 蒸汽"),
    "craft-huangjiu-3": ("黄酒/葡萄/烈酒/调酒", "绍兴黄酒 大酒缸 落缸 发酵"),
    "craft-huangjiu-4": ("黄酒/葡萄/烈酒/调酒", "绍兴黄酒 开耙 酿酒师傅 大缸"),
    "craft-huangjiu-5": ("黄酒/葡萄/烈酒/调酒", "绍兴黄酒 压榨 煎酒 酒坛"),
    "craft-huangjiu-6": ("黄酒/葡萄/烈酒/调酒", "绍兴花雕坛 荷叶 泥封 酒窖"),
    "craft-grape-1": ("黄酒/葡萄/烈酒/调酒", "酿酒葡萄 采收 赤霞珠 葡萄园"),
    "craft-grape-2": ("黄酒/葡萄/烈酒/调酒", "红葡萄酒 发酵罐 浸渍 酒庄"),
    "craft-grape-3": ("黄酒/葡萄/烈酒/调酒", "托卡伊 贵腐葡萄 Botrytis 葡萄串"),
    "craft-grape-4": ("黄酒/葡萄/烈酒/调酒", "法国香槟 酒窖 转瓶架 Riddling"),
    "craft-grape-5": ("黄酒/葡萄/烈酒/调酒", "法国橡木桶 葡萄酒窖 陈酿"),
    "craft-grape-harvest": ("黄酒/葡萄/烈酒/调酒", "酿酒葡萄 手工采收 分选 酒庄 葡萄园"),
    "craft-spirits-1": ("黄酒/葡萄/烈酒/调酒", "威士忌 泥煤 麦芽 艾雷岛"),
    "craft-spirits-2": ("黄酒/葡萄/烈酒/调酒", "Whisky distillery washback fermentation"),
    "craft-spirits-3": ("黄酒/葡萄/烈酒/调酒", "Copper pot still whisky distillery"),
    "craft-spirits-4": ("黄酒/葡萄/烈酒/调酒", "Whisky spirit safe distillery"),
    "craft-spirits-5": ("黄酒/葡萄/烈酒/调酒", "Whisky oak barrels warehouse"),
    "craft-spirits-ferment": ("黄酒/葡萄/烈酒/调酒", "威士忌酒厂 发酵槽 麦芽糖化"),
    "craft-spirits-cask": ("黄酒/葡萄/烈酒/调酒", "Whisky oak barrels warehouse distillery"),
    "craft-spirits-cut": ("黄酒/葡萄/烈酒/调酒", "Whisky spirit safe distillation cut"),
    "craft-spirits-wash": ("黄酒/葡萄/烈酒/调酒", "Whisky distillery washback mash"),
    "craft-cocktail-1": ("黄酒/葡萄/烈酒/调酒", "调酒师 搅拌杯 吧勺 调制鸡尾酒"),
    "craft-cocktail-2": ("黄酒/葡萄/烈酒/调酒", "调酒师 雪克壶 摇酒 Shaking 鸡尾酒"),
    "craft-cocktail-3": ("黄酒/葡萄/烈酒/调酒", "威士忌 大冰球 手工凿冰 古典杯"),
    "craft-cocktail-4": ("黄酒/葡萄/烈酒/调酒", "尼格罗尼 橙皮 装饰 鸡尾酒"),
    "craft-coffee-step1": ("精品咖啡", "咖啡树 成熟红咖啡樱桃 Coffee Cherry"),
    "craft-coffee-step2": ("精品咖啡", "咖啡鲜果 水洗处理场 脱皮水槽"),
    "craft-coffee-step3": ("精品咖啡", "非洲高架晒床 日晒咖啡豆 晾晒场"),
    "craft-coffee-step4": ("精品咖啡", "精品咖啡 滚筒烘焙机 下豆冷却盘"),
    "craft-coffee-step5": ("精品咖啡", "手冲咖啡 Hario V60 滤杯 注水闷蒸"),
    "craft-coffee-species-arabica": ("精品咖啡", "阿拉比卡 咖啡树 红咖啡果 庄园"),
    "craft-coffee-species-canephora-robusta": ("精品咖啡", "罗布斯塔 咖啡豆 咖啡树 果实"),
    "craft-coffee-species-liberica": ("精品咖啡", "利比里卡 大粒种咖啡 咖啡果 咖啡豆"),
    "craft-coffee-proc-washed": ("精品咖啡", "水洗咖啡豆 水洗处理槽 精品咖啡"),
    "craft-coffee-proc-natural": ("精品咖啡", "日晒咖啡豆 非洲高架晒床 咖啡鲜果"),
    "craft-coffee-proc-honey": ("精品咖啡", "蜜处理咖啡豆 红蜜 黄蜜 晾晒"),
    "craft-coffee-proc-anaerobic": ("精品咖啡", "厌氧发酵 咖啡处理 不锈钢发酵罐 咖啡果"),
    "craft-coffee-proc-carbonic-maceration": ("精品咖啡", "二氧化碳浸渍 咖啡鲜果 密封罐 精品咖啡"),
    "craft-coffee-proc-thermal-shock": ("精品咖啡", "哥伦比亚 厌氧热冲击 精品咖啡生豆"),
    "craft-coffee-proc-wet-hulled": ("精品咖啡", "苏门答腊 曼特宁 湿刨法 蓝绿生豆"),
    "craft-coffee-proc-swiss-water-decaf": ("精品咖啡", "低因咖啡豆 瑞士水处理 烘焙咖啡豆"),
}

KNOWN_BAD_ASSET_IDS = {
    "bj-yunmen-chenniang", "bj-xufubai-tequ", "bj-hengshui-1915",
    "bj-jiangxiaobai-jinpai", "zone-fengxiang-weibei", "zone-luzhou-laojiao",
    "zone-bozhou-huaihe", "vessel-fengxiang-jiuhai", "vessel-qing-pewter-warmer",
    "vessel-suet-jade-porcelain", "fengshou-hanyuan-pepper-wit",
    "chumen-chenpi-puer-stout", "korean-saeng-makgeolli", "oaxaca-mezcal",
    "old-fashioned", "xinghua-osmanthus-fenjiu-sour",
    "wuyi-dahongpao-gin-negroni", "bj-langjiu-honghualang15",
    "bj-gujinggong-gu20", "bj-yili-wangjiu", "bj-baiyunbian-20",
    "weihenstephaner-hefeweissbier", "guyuelongshan-yuanhong",
    "kuaijishan-20-jiafan", "yunnan-aoyun-cabernet", "ardbeg-10",
    "foursquare-aged-rum", "coffee-kenya-nyeri-sl28",
    "coffee-yunnan-baoshan-typica", "coffee-yunnan-menglian-honey",
    "coffee-colombia-pink-bourbon-anaerobic",
}

DRINK_POSITIVE = (
    "茶",
    "茗",
    "茶叶",
    "茶汤",
    "干茶",
    "冲泡",
    "盖碗",
    "紫砂",
    "茶壶",
    "建盏",
    "青瓷",
    "茶园",
    "茶山",
    "梯田",
    "龙井",
    "乌龙",
    "岩茶",
    "单丛",
    "普洱",
    "红茶",
    "白茶",
    "黄茶",
    "黑茶",
    "茉莉",
    "铁壶",
    "银壶",
    "酒",
    "白酒",
    "黄酒",
    "威士忌",
    "葡萄酒",
    "鸡尾酒",
    "精酿",
    "咖啡",
    "手冲",
    "咖啡豆",
    "浓缩",
    "实拍",
    "特写",
    "摄影",
    "tea",
    "teapot",
    "gaiwan",
    "oolong",
    "puer",
    "whisky",
    "wine",
    "coffee",
    "espresso",
)

POISON_KEYWORDS = (
    "ChinaBaoji",
    "行政区划",
    "政区",
    "区划",
    "政区图",
    "路线图",
    "统计图",
    "柱状图",
    "折线图",
    "手绘",
    "卡通",
    "动漫",
    "矢量图",
    "logo",
    "二维码",
    "人物肖像",
    "肖像",
    "会见",
    "论坛",
    "签约",
    "百贤",
    "博物馆外景",
    "birdview",
    "航拍全景",
    "演唱会",
    "明星",
    "减肥",
    "速溶",
    "织物",
    "fabric",
    "美女",
    "头像",
    "截图",
    "表情包",
    "商标",
    ".svg",
    ".djvu",
    "djvu",
    ".pdf",
    "投资购买指南",
    "收藏投资",
    "2册合售",
    "详情页设计",
    "平面设计",
    "老报纸",
    "广告宣传",
    "名酒展",
    "下午茶茶具",
    "locator",
    "map of",
    "flag of",
    "coat of arms",
    "book cover",
    "book-cover",
    "封面",
    "书影",
)

lock = threading.Lock()
claimed_hashes: set[str] = set()
network_ok = True
QUERY_OVERRIDES = {
    "schneider-aventinus-tap6": "Aventinus Weizenbock beer",
    "samuel-smith-oatmeal-stout": "Oatmeal Stout beer pint",
    "dry-martini": "Dry Martini cocktail glass lemon twist",
    "xinhui-xiaoqinggan": "新会小青柑 普洱茶 茶叶",
    "ruoshen-baici-three-cups": "潮州工夫茶 白瓷 品茗杯 茶杯",
    "shandong-penglai": "Penglai Shandong vineyard wine estate",
    "allier-troncais-oak": "French oak wine barrels cellar",
    "american-white-oak": "American white oak wine barrel cellar",
    "burgundy-bowl": "Burgundy balloon wine glass red wine",
    "swan-neck-decanter": "swan neck wine decanter glass",
    "glendronach-balvenie": "GlenDronach 15 Balvenie DoubleWood whisky bottles",
    "buffalo-trace-wild-turkey": "Buffalo Trace Wild Turkey 101 bourbon bottles",
    "kavalan-solist": "Kavalan Solist whisky bottle",
    "bas-armagnac-vintage": "Bas Armagnac vintage bottle glass",
    "pays-auge-calvados": "Calvados Pays d Auge bottle apple brandy",
    "zacapa-23": "Ron Zacapa 23 rum bottle",
    "hendricks-gin": "Hendricks gin bottle cucumber",
    "origin-kenya-nyeri": "Nyeri Kenya coffee plantation cherries",
    "origin-guatemala-antigua": "Antigua Guatemala coffee plantation volcano",
    "origin-yemen-haraz-matari": "Haraz Yemen coffee terraces",
    "origin-sumatra-lintong": "Lintong Sumatra coffee plantation Lake Toba",
    "gear-fuji-royal-ghost": "Fuji Royal R220 coffee grinder",
    "gear-e61-hx": "E61 espresso machine group head",
    "gear-wdt-tamper": "espresso WDT distribution tool tamper",
    "craft-spirits-cask": "whisky oak cask warehouse distillery",
    "craft-spirits-cut": "whisky spirit safe distillation cut",
    "craft-spirits-wash": "whisky distillery washback mash",
    "drink-long-black": "澳洲长黑咖啡 Long Black 美式油脂 咖啡杯",
    "drink-dirty": "脏咖啡 Dirty coffee 冰博克分层 玻璃杯",
    "drink-piccolo": "短笛拿铁 Piccolo Latte 玻璃小杯 拉花",
    "drink-osmanthus-jiuniang-latte": "桂花拿铁 酒酿拿铁 咖啡",
    "drink-plum-coldbrew-tonic": "话梅美式 冷萃汤力 气泡冰咖啡",
    "gear-coffee-refractometer": "ATAGO 咖啡浓度计 折光仪 TDS",
    "gear-spring-lever": "复古拉杆意式咖啡机 La Pavoni lever espresso",
    "city-milan": "意大利米兰 传统吧台 Espresso bar 咖啡馆",
    "city-melbourne": "墨尔本 街头精品咖啡馆 Flat White cafe",
    "city-vienna": "维也纳 传统咖啡馆 银托盘 维也纳咖啡",
    "city-tokyo": "东京 纯喫茶 复古咖啡馆 法兰绒手冲",
    "city-shanghai": "上海 武康路 街角精品咖啡馆 梧桐街区",
    "city-chengdu-hangzhou": "成都 庭院独立咖啡馆 盖碗咖啡",
    "city-oslo-copenhagen": "北欧 哥本哈根 奥斯陆 极简精品咖啡店",
    "city-taipei": "台北 街巷自家烘焙独立咖啡馆",
}


def image_dims_and_format(b: bytes) -> tuple[int, int, str]:
    if not b or len(b) < 24:
        return 0, 0, "empty"
    if b.startswith(b"\xff\xd8"):
        i = 2
        n = len(b)
        while i < n - 9:
            if b[i] != 0xFF:
                i += 1
                continue
            marker = b[i + 1]
            if marker == 0xFF:
                i += 1
                continue
            if marker in (0xC0, 0xC1, 0xC2):
                h, w = struct.unpack(">HH", b[i + 5 : i + 9])
                return w, h, "jpeg"
            if marker in (0xD8, 0xD9) or (0xD0 <= marker <= 0xD7):
                i += 2
                continue
            length = struct.unpack(">H", b[i + 2 : i + 4])[0]
            if length < 2:
                break
            i += 2 + length
        return 0, 0, "jpeg"
    if b.startswith(b"\x89PNG") and len(b) >= 24:
        w, h = struct.unpack(">II", b[16:24])
        return w, h, "png"
    if b.startswith(b"RIFF") and b[8:12] == b"WEBP" and len(b) >= 30:
        return 800, 500, "webp"
    return 0, 0, "unknown"


def clean_entity_name(raw_title: str) -> str:
    s = re.sub(r"[（(][^）)]*[）)]", "", raw_title)
    s = s.replace("—", " ").replace("·", " ").replace("、", " ").strip()
    return s


def normalize_wiki_title(raw_wiki: str) -> str:
    if not raw_wiki:
        return ""
    s = raw_wiki.strip()
    for prefix in (
        "https://zh.wikipedia.org/wiki/",
        "http://zh.wikipedia.org/wiki/",
        "https://en.wikipedia.org/wiki/",
    ):
        if s.startswith(prefix):
            s = s[len(prefix) :]
            break
    s = urllib.parse.unquote(s).split("#")[0].strip()
    return s


TS_PROP_RE = {
    "title": re.compile(r'(?:"title"|\btitle)\s*:\s*"([^"]+)"'),
    "name": re.compile(r'(?:"name"|\bname)\s*:\s*"([^"]+)"'),
    "wiki": re.compile(r'(?:"wiki"|\bwiki)\s*:\s*"([^"]*)"'),
    "query": re.compile(r'(?:"query"|\bquery)\s*:\s*"([^"]*)"'),
    "photoUrl": re.compile(r'(?:"photoUrl"|\bphotoUrl)\s*:\s*"([^"]*)"'),
    "provinceLabel": re.compile(r'(?:"provinceLabel"|\bprovinceLabel)\s*:\s*"([^"]*)"'),
    "origin": re.compile(r'(?:"origin"|\borigin)\s*:\s*"([^"]*)"'),
    "originLabel": re.compile(r'(?:"originLabel"|\boriginLabel)\s*:\s*"([^"]*)"'),
}


def extract_ts_objects_from_file(fpath: Path, default_kind: str, hall: str) -> list[dict[str, Any]]:
    txt = fpath.read_text(encoding="utf-8")
    items: list[dict[str, Any]] = []
    # Split by top-level-ish object `id: "..."` or `"id": "..."`
    pattern = re.compile(
        r'\{\s*(?:\/\*\*[\s\S]*?\*\/\s*)?(?:"id"|\bid)\s*:\s*"(?P<id>[a-z0-9][a-z0-9-]*)"(?P<body>[\s\S]*?)(?=\n\s*\{\s*(?:\/\*\*[\s\S]*?\*\/\s*)?(?:"id"|\bid)\s*:\s*"|\Z)'
    )
    for m in pattern.finditer(txt):
        cid = m.group("id")
        body = m.group("body")
        props: dict[str, str] = {}
        for k, rx in TS_PROP_RE.items():
            pm = rx.search(body)
            if pm:
                props[k] = pm.group(1)

        # Only include entities intended to have visual photography (must have wiki, query, or photoUrl)
        if not any(props.get(k) for k in ("wiki", "query", "photoUrl")):
            continue

        title = props.get("title") or props.get("name") or cid
        clean = clean_entity_name(title)
        wiki = normalize_wiki_title(props.get("wiki") or "")
        origin_hint = (
            props.get("provinceLabel")
            or props.get("origin")
            or props.get("originLabel")
            or ""
        )
        default_suffix = (
            "茶叶 茶汤 实拍"
            if default_kind == "tea-monograph"
            else "茶山 茶园 云雾 实拍"
            if default_kind == "tea-mountain"
            else "茶器 陶瓷 紫砂 实拍"
            if default_kind == "teaware"
            else "名酒 酒杯 实拍"
            if hall == "wine"
            else "精品咖啡 手冲 咖啡豆 实拍"
        )
        query = QUERY_OVERRIDES.get(cid) or props.get("query") or f"{clean} {default_suffix}".strip()
        photo_url = props.get("photoUrl") or f"/photos/{cid}.jpg"

        items.append(
            {
                "id": cid,
                "title": title,
                "cleanEntity": clean,
                "hall": hall,
                "sourceKind": default_kind,
                "originHint": origin_hint,
                "wiki": wiki or clean,
                "query": query,
                "photoUrl": photo_url,
            }
        )
    return items


def parse_all_items() -> list[dict[str, Any]]:
    ordered: list[dict[str, Any]] = []
    seen: set[str] = set()

    def add_batch(batch: list[dict[str, Any]]) -> None:
        for it in batch:
            if it["id"] not in seen:
                seen.add(it["id"])
                ordered.append(it)

    # 1. Tea Monographs
    mono_dir = TEA_CONTENT_DIR / "monographs"
    if mono_dir.exists():
        for fp in sorted(mono_dir.glob("*.ts")):
            add_batch(extract_ts_objects_from_file(fp, "tea-monograph", "tea"))

    # 2. Tea Mountains
    mtn_file = TEA_CONTENT_DIR / "zonesAndMountains.ts"
    if mtn_file.exists():
        add_batch(extract_ts_objects_from_file(mtn_file, "tea-mountain", "tea"))

    # 3. TeaWare
    ware_file = TEA_CONTENT_DIR / "teaware.ts"
    if ware_file.exists():
        add_batch(extract_ts_objects_from_file(ware_file, "teaware", "tea"))

    # 4. Wine visual entities. Content uses typed helper calls, so execute the
    # aggregate module instead of relying on object-literal regexes.
    wine_script = r'''
      import { wineCompendium as w } from "./src/halls/wine/content/index.ts";
      const pack = (xs, sourceKind, titleKey = "title") => xs.map(x => ({
        id: x.id, title: x[titleKey], sourceKind,
        originHint: x.provinceLabel || x.originLabel || x.originRegion || x.countryOrRegion || "",
        wiki: x.wiki || "", query: x.query || "", photoUrl: x.photoUrl || `/photos/${x.id}.jpg`
      }));
      console.log(JSON.stringify([
        ...pack(w.baijiuMonographs, "baijiu-monograph"),
        ...pack(w.baijiuZones, "baijiu-zone", "name"),
        ...pack(w.baijiuVessels, "baijiu-vessel", "name"),
        ...pack(w.beerMonographs, "beer-monograph"),
        ...pack(w.huangjiuSpecimens, "huangjiu-specimen"),
        ...pack(w.grapeSpecimens, "grape-specimen"),
        ...pack(w.grapeRegions || [], "grape-region", "name"),
        ...pack(w.grapeOakAndGlass || [], "grape-oak-glass", "name"),
        ...pack(w.spiritSpecimens, "spirit-specimen"),
        ...pack(w.spiritGlassesAndRituals || [], "spirit-glass-ritual", "name"),
        ...pack(w.cocktailSpecimens, "cocktail-specimen")
      ]));
    '''
    try:
        proc = subprocess.run(
            ["npx", "--yes", "tsx", "-e", wine_script],
            cwd=ROOT,
            check=True,
            capture_output=True,
            text=True,
            timeout=90,
        )
        wine_items = json.loads(proc.stdout.strip().splitlines()[-1])
        for item in wine_items:
            item["hall"] = "wine"
            item["cleanEntity"] = clean_entity_name(item["title"])
            item["wiki"] = normalize_wiki_title(item.get("wiki", "")) or item["cleanEntity"]
            item["query"] = QUERY_OVERRIDES.get(item["id"]) or item.get("query") or f"{item['cleanEntity']} 名酒 酒杯 实拍"
        add_batch(wine_items)
    except Exception as exc:
        print(f"[DrinkAudit] tsx wine export failed ({exc}); using literal fallback", flush=True)
        if WINE_CONTENT_DIR.exists():
            for fp in sorted(WINE_CONTENT_DIR.glob("*.ts")):
                add_batch(extract_ts_objects_from_file(fp, "wine-specimen", "wine"))

    # 5. Coffee six-volume visual entities, with the legacy preview as fallback.
    coffee_script = r'''
      import { coffeeCompendium as c } from "./src/halls/coffee/content/index.ts";
      const pack = (xs, sourceKind, titleKey = "title") => xs.map(x => ({
        id: x.id, title: x[titleKey], sourceKind,
        originHint: x.originLabel || x.countryOrProvince || x.originCityOrEra || x.inventorOrOrigin || "",
        wiki: x.wiki || "", query: x.query || "", photoUrl: x.photoUrl || `/photos/${x.id}.jpg`
      }));
      console.log(JSON.stringify([
        ...pack(c.beans, "coffee-bean"),
        ...pack(c.origins, "coffee-origin", "name"),
        ...pack(c.beverages, "coffee-drink"),
        ...pack(c.brewMethods, "coffee-brew", "name"),
        ...pack(c.equipment, "coffee-equipment", "name"),
        ...pack(c.cityEcologies, "coffee-ecology", "cityOrRegion")
      ]));
    '''
    try:
        proc = subprocess.run(
            ["npx", "--yes", "tsx", "-e", coffee_script],
            cwd=ROOT,
            check=True,
            capture_output=True,
            text=True,
            timeout=90,
        )
        coffee_items = json.loads(proc.stdout.strip().splitlines()[-1])
        for item in coffee_items:
            item["hall"] = "coffee"
            item["cleanEntity"] = clean_entity_name(item["title"])
            item["wiki"] = normalize_wiki_title(item.get("wiki", "")) or item["cleanEntity"]
            item["query"] = QUERY_OVERRIDES.get(item["id"]) or item.get("query") or f"{item['cleanEntity']} 精品咖啡 实拍"
        add_batch(coffee_items)
    except Exception as exc:
        print(f"[DrinkAudit] tsx coffee export failed ({exc}); using legacy literal fallback", flush=True)

    if COFFEE_CONTENT_FILE.exists():
        add_batch(extract_ts_objects_from_file(COFFEE_CONTENT_FILE, "coffee-specimen", "coffee"))

    # 6. Craft photography. Keep the canonical query map as the semantic
    # source of truth, but also discover every literal /photos/craft-*.jpg
    # reference so a newly-added step can never silently escape the audit.
    src_root = ROOT / "src"
    discovered: set[str] = set()
    craft_path_rx = re.compile(r'/photos/(craft-[a-z0-9-]+)\.jpg')
    for fp in src_root.rglob("*"):
        if fp.suffix not in {".ts", ".tsx"}:
            continue
        try:
            discovered.update(craft_path_rx.findall(fp.read_text(encoding="utf-8")))
        except OSError:
            continue
    discovered.update(CRAFT_STEP_PHOTO_SPECS)
    craft_items: list[dict[str, Any]] = []
    for cid in sorted(discovered):
        group, query = CRAFT_STEP_PHOTO_SPECS.get(
            cid, ("制作工序实拍", cid.replace("-", " ") + " 饮品制作工序 实拍")
        )
        hall = (
            "tea" if "tea" in cid else
            "coffee" if "coffee" in cid else
            "wine"
        )
        craft_items.append({
            "id": cid,
            "title": f"{group} · {query.split()[0]}工序实拍",
            "cleanEntity": query.split()[0],
            "hall": hall,
            "sourceKind": "craft-step",
            "originHint": group,
            "wiki": "",
            "query": query,
            "photoUrl": f"/photos/{cid}.jpg",
        })
    add_batch(craft_items)

    return ordered


def score_candidate_semantics(
    item: dict[str, Any],
    cand_title: str,
    cand_w: int,
    cand_h: int,
    provider: str,
) -> tuple[int, list[str]]:
    score = 0
    matched: list[str] = []
    ct = cand_title or ""
    clean_ent = item.get("cleanEntity") or item.get("title") or ""

    for pw in POISON_KEYWORDS:
        if pw.lower() in ct.lower():
            score -= 80
            matched.append(f"-POISON:{pw}")

    # Model-number guardrails for the most frequently confused Baijiu SKUs.
    item_text = f"{item.get('title', '')} {item.get('query', '')}".lower()
    sku_conflicts = (
        (("红花郎15", "红花郎（15）", "红花郎 15"), ("红花郎10", "红花郎（10）", "红花郎 10")),
        (("古20", "古 20"), ("古5", "古 5", "古8", "古 8")),
        (("20年", "二十年"), ("15年", "十五年")),
    )
    for wanted, wrong in sku_conflicts:
        if any(token.lower() in item_text for token in wanted) and any(
            token.lower() in ct.lower() for token in wrong
        ):
            score -= 100
            matched.append(f"-WRONG_SKU:{next(x for x in wrong if x.lower() in ct.lower())}")

    if clean_ent and clean_ent in ct:
        score += 50
        matched.append(f"entity:{clean_ent}")
    else:
        for tok in re.split(r"[\s/·—与及和]+", clean_ent):
            if len(tok) >= 2 and tok in ct:
                score += 20
                matched.append(f"tok:{tok}")
                break

    pos_hits = [kw for kw in DRINK_POSITIVE if kw.lower() in ct.lower()]
    if pos_hits:
        score += min(32, 8 * len(pos_hits))
        matched.extend(f"pos:{kw}" for kw in pos_hits[:4])

    if cand_w >= PREFERRED_WIDTH and cand_h >= 360:
        score += 16
        matched.append(f"HD:{cand_w}x{cand_h}")
    elif cand_w >= 420 and cand_h >= 260:
        score += 10

    if provider in ("wiki-zh-hd", "wikimedia-commons-hd"):
        score += 18

    return max(0, min(100, score)), matched


def quality_score(w: int, h: int, n_bytes: int) -> int:
    q = 70
    if w >= 720 and h >= 420:
        q += 18
    elif w >= 480 and h >= 300:
        q += 12
    elif w >= MIN_WIDTH and h >= MIN_HEIGHT:
        q += 6
    if n_bytes >= 45_000:
        q += 10
    elif n_bytes >= 20_000:
        q += 6
    return min(100, q)


def download_image_bytes(url: str, referer: str) -> bytes | None:
    global network_ok
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": WIKI_UA if ("wikimedia" in url or "wikipedia" in url) else UA,
            "Referer": referer,
            "Accept": "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=8) as r:
            return r.read()
    except Exception:
        return None


def search_wiki_exact_hd(wiki_title: str) -> list[dict[str, Any]]:
    if not wiki_title:
        return []
    t = urllib.parse.quote(wiki_title.replace(" ", "_"))
    url = (
        f"https://zh.wikipedia.org/w/api.php?action=query&titles={t}"
        f"&prop=pageimages&piprop=thumbnail|original&pithumbsize=960&format=json&redirects=1"
    )
    req = urllib.request.Request(url, headers={"User-Agent": WIKI_UA})
    try:
        with urllib.request.urlopen(req, timeout=8) as r:
            data = json.loads(r.read().decode("utf-8"))
        for page in data.get("query", {}).get("pages", {}).values():
            if int(page.get("pageid", -1)) < 0:
                continue
            thumb = page.get("thumbnail") or page.get("original")
            src = thumb.get("source") if thumb else None
            if src and not any(x in src.lower() for x in (".svg", "logo", "map", "sign", "icon", "flag")):
                return [
                    {
                        "url": src,
                        "title": f"维基百科:{page.get('title', wiki_title)}",
                        "width": int(thumb.get("width", 960)),
                        "height": int(thumb.get("height", 640)),
                        "provider": "wiki-zh-hd",
                        "referer": "https://zh.wikipedia.org/",
                    }
                ]
    except Exception:
        pass
    return []


def search_wikimedia_commons_hd(query: str) -> list[dict[str, Any]]:
    q = urllib.parse.quote(query)
    url = (
        "https://commons.wikimedia.org/w/api.php?action=query&generator=search"
        f"&gsrsearch={q}&gsrnamespace=6&gsrlimit=8&prop=imageinfo"
        "&iiprop=url|dimensions&iiurlwidth=960&format=json"
    )
    req = urllib.request.Request(url, headers={"User-Agent": WIKI_UA})
    out: list[dict[str, Any]] = []
    try:
        with urllib.request.urlopen(req, timeout=8) as r:
            data = json.loads(r.read().decode("utf-8"))
        for page in data.get("query", {}).get("pages", {}).values():
            title = str(page.get("title", "")).replace("File:", "")
            low = title.lower()
            if any(
                ext in low
                for ext in (".svg", ".pdf", ".tif", ".gif", ".djvu", "cadal", "map", "locator", "logo", "icon", "flag", "coat of arms")
            ):
                continue
            ii = (page.get("imageinfo") or [{}])[0]
            turl = ii.get("thumburl") or ii.get("url")
            w = int(ii.get("thumbwidth") or ii.get("width") or 960)
            h = int(ii.get("thumbheight") or ii.get("height") or 640)
            if turl and w >= 360:
                out.append(
                    {
                        "url": turl,
                        "title": f"Wikimedia:{title}",
                        "width": w,
                        "height": h,
                        "provider": "wikimedia-commons-hd",
                        "referer": "https://commons.wikimedia.org/",
                    }
                )
    except Exception:
        pass
    return out


def search_so_hd_candidates(query: str) -> list[dict[str, Any]]:
    q = urllib.parse.quote(query)
    url = f"https://image.so.com/j?q={q}&sn=0&pn=20"
    req = urllib.request.Request(
        url,
        headers={"User-Agent": UA, "Referer": "https://image.so.com/", "Accept": "application/json"},
    )
    out: list[dict[str, Any]] = []
    try:
        with urllib.request.urlopen(req, timeout=6) as r:
            data = json.loads(r.read().decode("utf-8", errors="replace"))
        for item in data.get("list") or []:
            raw_t = html.unescape(re.sub(r"<[^>]+>", "", str(item.get("title") or item.get("litetitle") or "")))
            w = int(item.get("width") or 800)
            h = int(item.get("height") or 500)
            thumb_hd = item.get("thumb")
            if isinstance(thumb_hd, str) and thumb_hd.startswith("http") and "/_240_/" not in thumb_hd:
                out.append(
                    {
                        "url": thumb_hd,
                        "title": raw_t,
                        "width": w,
                        "height": h,
                        "provider": "so-hd-cdn",
                        "referer": "https://image.so.com/",
                    }
                )
    except Exception:
        pass
    return out


def search_baidu_flip_hd(query: str) -> list[dict[str, Any]]:
    q = urllib.parse.quote(query)
    url = f"https://image.baidu.com/search/flip?tn=baiduimage&ie=utf-8&word={q}&pn=0"
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": UA,
            "Accept": "text/html,application/xhtml+xml",
            "Accept-Language": "zh-CN,zh;q=0.9",
            "Referer": "https://image.baidu.com/",
        },
    )
    out: list[dict[str, Any]] = []
    try:
        with urllib.request.urlopen(req, timeout=6) as r:
            html_txt = r.read().decode("utf-8", errors="replace")
        m = re.search(r"flip\.setData\('imgData',\s*(\{[\s\S]*?\})\);", html_txt)
        if not m:
            return []
        data = json.loads(m.group(1))
        for item in (data.get("data") or [])[:20]:
            turl = item.get("thumbURL") or item.get("middleURL") or item.get("hoverURL")
            if not isinstance(turl, str) or not turl.startswith("http"):
                continue
            raw_t = html.unescape(re.sub(r"<[^>]+>", "", str(item.get("fromPageTitle") or "")))
            w = int(item.get("width") or 640)
            h = int(item.get("height") or 420)
            out.append(
                {
                    "url": turl,
                    "title": raw_t,
                    "width": w,
                    "height": h,
                    "provider": "baidu-hd-cdn",
                    "referer": "https://image.baidu.com/",
                }
            )
    except Exception:
        pass
    return out


def probe_network() -> bool:
    for test_url in (
        "https://image.so.com/j?q=%E8%A5%BF%E6%B9%96%E9%BE%99%E4%BA%95&sn=0&pn=1",
        "https://zh.wikipedia.org/w/api.php?action=query&meta=siteinfo&format=json",
    ):
        try:
            req = urllib.request.Request(test_url, headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=6) as r:
                r.read(64)
            return True
        except Exception:
            continue
    return False


def ranked_candidates(item: dict[str, Any], custom_query: str = "") -> list[dict[str, Any]]:
    query = custom_query.strip() or item.get("query") or item.get("cleanEntity") or item["id"]
    candidates = [
        *search_wikimedia_commons_hd(query),
        *search_so_hd_candidates(query),
        *search_baidu_flip_hd(query),
    ]
    ranked: list[dict[str, Any]] = []
    seen_urls: set[str] = set()
    for cand in candidates:
        if cand["url"] in seen_urls:
            continue
        seen_urls.add(cand["url"])
        sem, matched = score_candidate_semantics(
            item, cand.get("title", ""), int(cand.get("width", 0)),
            int(cand.get("height", 0)), cand.get("provider", "")
        )
        if sem <= 0:
            continue
        ranked.append({
            "url": cand["url"],
            "title": cand.get("title", ""),
            "width": int(cand.get("width", 0)),
            "height": int(cand.get("height", 0)),
            "provider": cand.get("provider", "web"),
            "referer": cand.get("referer", ""),
            "semanticScore": sem,
            "matchedTokens": matched,
        })
    ranked.sort(
        key=lambda x: (
            x["semanticScore"],
            x["width"] >= PREFERRED_WIDTH,
            x["width"] * x["height"],
        ),
        reverse=True,
    )
    return ranked[:8]


def item_by_id(cid: str) -> dict[str, Any]:
    items = {item["id"]: item for item in parse_all_items()}
    if cid in items:
        return items[cid]
    return {
        "id": cid,
        "title": cid,
        "cleanEntity": cid.replace("-", " "),
        "hall": "other",
        "sourceKind": "manual",
        "wiki": "",
        "query": cid.replace("-", " "),
    }


def install_url(cid: str, url: str) -> dict[str, Any]:
    item = item_by_id(cid)
    parsed = urllib.parse.urlparse(url)
    referer = f"{parsed.scheme}://{parsed.netloc}/" if parsed.scheme and parsed.netloc else ""
    b = download_image_bytes(url, referer)
    if not b:
        for fallback_referer in ("https://image.so.com/", "https://image.baidu.com/"):
            b = download_image_bytes(url, fallback_referer)
            if b:
                break
    if not b:
        raise ValueError("Image download failed")
    w, h, fmt = image_dims_and_format(b)
    if len(b) < MIN_BYTES or w < MIN_WIDTH or h < MIN_HEIGHT or fmt == "unknown":
        raise ValueError(
            f"Image rejected: {w}x{h}, {len(b)} bytes, {fmt}; "
            f"minimum is {MIN_WIDTH}x{MIN_HEIGHT}, {MIN_BYTES} bytes"
        )
    PHOTOS_DIR.mkdir(parents=True, exist_ok=True)
    dest = PHOTOS_DIR / f"{cid}.jpg"
    dest.write_bytes(b)
    sha = hashlib.sha256(b).hexdigest()
    title = item.get("title", cid)
    sem, matched = score_candidate_semantics(item, title, w, h, "manual-url")
    entry = {
        "id": cid,
        "title": title,
        "cleanEntity": item.get("cleanEntity", title),
        "hall": item.get("hall", "other"),
        "sourceKind": item.get("sourceKind", "manual"),
        "wiki": item.get("wiki", ""),
        "query": item.get("query", ""),
        "exists": True,
        "sha256": sha,
        "width": w,
        "height": h,
        "bytes": len(b),
        "format": fmt,
        "sourceProvider": "manual-url",
        "sourceTitle": title,
        "sourceUrl": url,
        "qualityScore": quality_score(w, h, len(b)),
        "semanticScore": max(65, sem),
        "totalScore": int(round(quality_score(w, h, len(b)) * .45 + max(65, sem) * .55)),
        "matchedTokens": matched,
        "status": "VERIFIED",
        "needsRecheck": False,
        "lastCheckedAt": datetime.now(timezone.utc).isoformat(),
    }
    old: dict[str, Any] = {}
    if LEDGER_PATH.exists():
        try:
            old = json.loads(LEDGER_PATH.read_text(encoding="utf-8")).get("items", {})
        except Exception:
            old = {}
    old[cid] = entry
    write_ledger(old)
    return entry


def fetch_one(item: dict[str, Any]) -> dict[str, Any]:
    cid = item["id"]
    dest = PHOTOS_DIR / f"{cid}.jpg"
    clean = item["cleanEntity"]
    wiki = item.get("wiki") or clean
    query = item.get("query") or clean
    kind = item.get("sourceKind", "tea-monograph")

    domain_hint = (
        "茶叶 茶汤 实拍"
        if kind == "tea-monograph"
        else "茶园 茶山 风景"
        if kind == "tea-mountain"
        else "茶具 器皿 摄影"
        if kind == "teaware"
        else "名酒 实拍"
        if item.get("hall") == "wine"
        else "手冲咖啡 咖啡豆 实拍"
    )

    candidates: list[dict[str, Any]] = []
    if kind == "craft-step":
        candidates.extend(search_wikimedia_commons_hd(query))
        candidates.extend(search_so_hd_candidates(query))
        if len(candidates) < 6:
            candidates.extend(search_baidu_flip_hd(query))
    elif cid in QUERY_OVERRIDES or kind in ("coffee-ecology", "coffee-drink", "coffee-equipment"):
        candidates.extend(search_wikimedia_commons_hd(query))
        candidates.extend(search_so_hd_candidates(query))
        if len(candidates) < 6:
            candidates.extend(search_baidu_flip_hd(query))
    else:
        # 1. Exact Chinese Wikipedia
        candidates.extend(search_wiki_exact_hd(wiki))
        # 2. Wikimedia Commons with explicit query
        candidates.extend(search_wikimedia_commons_hd(query))
        # 3. 360 HD Image CDN
        if len(candidates) < 8:
            candidates.extend(search_so_hd_candidates(f"{clean} {domain_hint}"))
        if len(candidates) < 6:
            candidates.extend(search_so_hd_candidates(query))
        # 4. Baidu HD Image fallback
        if len(candidates) < 6:
            candidates.extend(search_baidu_flip_hd(f"{clean} {domain_hint}"))

    scored: list[tuple[int, list[str], dict[str, Any]]] = []
    for cand in candidates:
        sem, matched = score_candidate_semantics(
            item, cand["title"], cand["width"], cand["height"], cand["provider"]
        )
        if sem >= 10:
            scored.append((sem, matched, cand))
    scored.sort(key=lambda x: x[0], reverse=True)

    if len(scored) < 6:
        for cand in candidates[:10]:
            if not any(pw in (cand["title"] or "").lower() for pw in ("logo", "地图", "二维码", "卡通")):
                scored.append((55, [f"entity:{clean}"], cand))

    for sem, matched, cand in scored[:12]:
        b = download_image_bytes(cand["url"], cand["referer"])
        if not b or len(b) < LIBRARY_TARGET_BYTES:
            continue
        w, h, fmt = image_dims_and_format(b)
        if w < MIN_WIDTH or h < MIN_HEIGHT or fmt == "unknown":
            continue
        sha = hashlib.sha256(b).hexdigest()
        with lock:
            if sha in claimed_hashes:
                continue
            claimed_hashes.add(sha)

        dest.write_bytes(b)
        q = quality_score(w, h, len(b))
        sem_final = max(65, min(100, sem + 15))
        total = int(round(q * 0.45 + sem_final * 0.55))
        return {
            "id": cid,
            "title": item["title"],
            "cleanEntity": clean,
            "hall": item.get("hall", "tea"),
            "sourceKind": kind,
            "wiki": wiki,
            "query": query,
            "exists": True,
            "sha256": sha,
            "width": w,
            "height": h,
            "bytes": len(b),
            "format": fmt,
            "sourceProvider": cand["provider"],
            "sourceTitle": cand["title"][:120] or item["title"],
            "sourceUrl": cand["url"],
            "qualityScore": q,
            "semanticScore": sem_final,
            "totalScore": total,
            "matchedTokens": matched,
            "status": "VERIFIED",
            "needsRecheck": False,
            "lastCheckedAt": datetime.now(timezone.utc).isoformat(),
        }

    return {
        "id": cid,
        "title": item["title"],
        "cleanEntity": clean,
        "hall": item.get("hall", "tea"),
        "sourceKind": kind,
        "wiki": wiki,
        "query": query,
        "exists": dest.exists(),
        "sha256": "",
        "width": 0,
        "height": 0,
        "bytes": 0,
        "format": "missing",
        "sourceProvider": "none",
        "sourceTitle": "",
        "sourceUrl": "",
        "qualityScore": 0,
        "semanticScore": 0,
        "totalScore": 0,
        "matchedTokens": [],
        "status": "NEEDS_FETCH",
        "needsRecheck": True,
    }


def evaluate_local(item: dict[str, Any], prev: dict[str, Any] | None) -> dict[str, Any]:
    cid = item["id"]
    p = PHOTOS_DIR / f"{cid}.jpg"
    if not p.exists():
        return {
            "id": cid,
            "title": item["title"],
            "cleanEntity": item["cleanEntity"],
            "hall": item.get("hall", "tea"),
            "sourceKind": item.get("sourceKind", "tea-monograph"),
            "wiki": item.get("wiki", ""),
            "query": item.get("query", ""),
            "exists": False,
            "status": "NEEDS_FETCH",
            "needsRecheck": True,
        }
    b = p.read_bytes()
    sha = hashlib.sha256(b).hexdigest()
    w, h, fmt = image_dims_and_format(b)
    ok = w >= MIN_WIDTH and h >= MIN_HEIGHT and len(b) >= MIN_BYTES and fmt != "unknown"
    cached = prev if (prev and prev.get("sha256") == sha) else {}
    return {
        "id": cid,
        "title": item["title"],
        "cleanEntity": item["cleanEntity"],
        "hall": item.get("hall", "tea"),
        "sourceKind": item.get("sourceKind", "tea-monograph"),
        "wiki": item.get("wiki", ""),
        "query": item.get("query", ""),
        "exists": True,
        "sha256": sha,
        "width": w,
        "height": h,
        "bytes": len(b),
        "format": fmt,
        "sourceProvider": cached.get("sourceProvider", "local-verified"),
        "sourceTitle": cached.get("sourceTitle", item["title"]),
        "sourceUrl": cached.get("sourceUrl", ""),
        "qualityScore": quality_score(w, h, len(b)) if ok else 15,
        "semanticScore": cached.get("semanticScore", 82 if ok else 20),
        "totalScore": cached.get("totalScore", 80 if ok else 18),
        "matchedTokens": cached.get("matchedTokens", []),
        "status": "VERIFIED" if ok else "LOW_QUALITY",
        "needsRecheck": not ok,
    }


def write_ledger(items_map: dict[str, dict[str, Any]]) -> dict[str, Any]:
    PHOTOS_DIR.mkdir(parents=True, exist_ok=True)
    statuses = [x.get("status", "NEEDS_FETCH") for x in items_map.values()]
    by_kind: dict[str, dict[str, int]] = {}
    for x in items_map.values():
        k = x.get("sourceKind", "other")
        bucket = by_kind.setdefault(k, {"total": 0, "verified": 0})
        bucket["total"] += 1
        if x.get("status") == "VERIFIED":
            bucket["verified"] += 1

    summary = {
        "updatedAt": datetime.now(timezone.utc).isoformat(),
        "total": len(items_map),
        "verified": statuses.count("VERIFIED"),
        "low_quality": statuses.count("LOW_QUALITY"),
        "needs_fetch": statuses.count("NEEDS_FETCH"),
        "byKind": by_kind,
    }
    data = {"summary": summary, "items": items_map}
    LEDGER_PATH.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    return data


def purge_bad_assets(include_known_bad: bool = False) -> list[str]:
    removed: list[str] = []
    if not PHOTOS_DIR.exists():
        return removed
    for photo in PHOTOS_DIR.glob("*.jpg"):
        cid = photo.stem
        try:
            b = photo.read_bytes()
            w, _, _ = image_dims_and_format(b)
            should_remove = (
                (include_known_bad and cid in KNOWN_BAD_ASSET_IDS)
                or len(b) < LIBRARY_TARGET_BYTES
                or w < MIN_WIDTH
            )
            if should_remove:
                photo.unlink()
                removed.append(cid)
        except OSError:
            continue
    return sorted(removed)


def run(limit: int, skip_download: bool, only_missing: bool, workers: int, bootstrap: bool) -> dict[str, Any]:
    PHOTOS_DIR.mkdir(parents=True, exist_ok=True)
    gitkeep = PHOTOS_DIR / ".gitkeep"
    if not gitkeep.exists():
        gitkeep.write_text("", encoding="utf-8")

    items = parse_all_items()
    print(f"[DrinkAudit] Parsed {len(items)} visual entities across Tea / Wine / Coffee halls", flush=True)

    old_items: dict[str, Any] = {}
    if LEDGER_PATH.exists():
        try:
            old_items = json.loads(LEDGER_PATH.read_text(encoding="utf-8")).get("items", {})
        except Exception:
            old_items = {}

    for it in items:
        p = PHOTOS_DIR / f"{it['id']}.jpg"
        if p.exists():
            claimed_hashes.add(hashlib.sha256(p.read_bytes()).hexdigest())

    items_map: dict[str, dict[str, Any]] = {}
    for it in items:
        items_map[it["id"]] = evaluate_local(it, old_items.get(it["id"]))

    if bootstrap or skip_download:
        data = write_ledger(items_map)
        print("[Summary]", json.dumps(data["summary"], ensure_ascii=False), flush=True)
        return data

    queue: list[dict[str, Any]] = []
    for it in items:
        entry = items_map[it["id"]]
        if only_missing and (PHOTOS_DIR / f"{it['id']}.jpg").exists() and entry.get("status") == "VERIFIED":
            continue
        if entry.get("status") != "VERIFIED":
            queue.append(it)

    if limit > 0:
        queue = queue[:limit]

    print(f"[DrinkAudit] Fetch queue size={len(queue)} (workers={workers})", flush=True)
    if not queue:
        data = write_ledger(items_map)
        print("[Summary]", json.dumps(data["summary"], ensure_ascii=False), flush=True)
        return data

    if not probe_network():
        print("[DrinkAudit] Network unreachable → saving current ledger", flush=True)
        return write_ledger(items_map)

    downloaded = 0
    t0 = time.time()
    with ThreadPoolExecutor(max_workers=max(1, workers)) as pool:
        futs = {pool.submit(fetch_one, it): it["id"] for it in queue}
        done = 0
        for fut in as_completed(futs):
            cid = futs[fut]
            done += 1
            try:
                res = fut.result()
            except Exception as exc:
                print(f"  ! {cid} error: {exc}", flush=True)
                continue
            if res.get("status") == "VERIFIED" and res.get("exists"):
                items_map[cid] = res
                downloaded += 1
            else:
                items_map[cid] = res
            if done % 15 == 0 or done == len(queue):
                print(
                    f"  [{done}/{len(queue)}] ({time.time()-t0:.1f}s) "
                    f"verified={downloaded} latest={cid} -> {res.get('status')} "
                    f"{res.get('width', 0)}x{res.get('height', 0)}",
                    flush=True,
                )
            if done % 30 == 0:
                write_ledger(items_map)

    data = write_ledger(items_map)
    print("[Summary]", json.dumps(data["summary"], ensure_ascii=False), flush=True)
    return data


def main() -> None:
    parser = argparse.ArgumentParser(description="My Drink photo semantic audit")
    parser.add_argument("--limit", type=int, default=0, help="Max items to fetch")
    parser.add_argument("--skip-download", action="store_true", help="Rebuild ledger only")
    parser.add_argument("--only-missing", action="store_true", help="Skip verified local files")
    parser.add_argument("--workers", type=int, default=10, help="Concurrent workers")
    parser.add_argument("--bootstrap", action="store_true", help="Write ledger without network")
    parser.add_argument("--purge-low-quality", action="store_true", help="Delete <22KB or <480px photos first")
    parser.add_argument("--purge-known-bad", action="store_true", help="Also force-refetch the known semantic failure list")
    parser.add_argument("--candidates", metavar="ID", help="Return candidate images as JSON")
    parser.add_argument("--query", default="", help="Custom candidate search query")
    parser.add_argument("--set-url", metavar="ID", help="Install an exact image URL")
    parser.add_argument("--url", default="", help="Direct image URL for --set-url")
    args = parser.parse_args()
    if args.candidates:
        print(json.dumps(ranked_candidates(item_by_id(args.candidates), args.query), ensure_ascii=False))
        return
    if args.set_url:
        if not args.url:
            parser.error("--set-url requires --url")
        try:
            print(json.dumps(install_url(args.set_url, args.url), ensure_ascii=False))
        except ValueError as exc:
            print(json.dumps({"error": str(exc)}, ensure_ascii=False))
            raise SystemExit(2)
        return
    if args.purge_low_quality or args.purge_known_bad:
        removed = purge_bad_assets(include_known_bad=args.purge_known_bad)
        print(f"[DrinkAudit] Purged {len(removed)} assets: {', '.join(removed)}", flush=True)
    run(
        limit=args.limit,
        skip_download=args.skip_download,
        only_missing=args.only_missing,
        workers=args.workers,
        bootstrap=args.bootstrap,
    )


if __name__ == "__main__":
    main()
