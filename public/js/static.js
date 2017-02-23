var static = {};

	var weibo_cate = {"1":"娱乐","2":"音乐","3":"电影","4":"美食","5":"粮油","6":"生鲜","7":"休闲","8":"星座命理","9":"时尚","10":"服装箱包","11":"美容美体","12":"家居","13":"生活","14":"情感","15":"资讯","16":"时政新闻","17":"社会新闻","18":"文艺","19":"购物","20":"宠物","100":"其它"};
	var wechat_official_cate = {"1":"新闻资讯","2":"时尚","3":"搞笑娱乐","4":"母婴","5":"旅游","6":"数码","7":"互联网","8":"美容","9":"汽车","10":"家居","11":"美食","12":"星座语录","13":"育儿","14":"财经","15":"情感","16":"游戏","17":"动漫","18":"购物","19":"体育","20":"健康养生","21":"教育培训","22":"营销","23":"运动健身","24":"宠物","100":"其它"};
	var wechat_cate = {"1":"网购","2":"服装","3":"美食","4":"美容","5":"育儿","6":"星座","7":"婚恋","8":"心情","9":"IT","10":"娱乐","11":"幽默搞笑","12":"健康养生","13":"体育运动","14":"旅游","15":"商业","16":"汽车","17":"文学","18":"家居","19":"摄影","20":"资讯"};
	var wechat_job = {"1":"模特","2":"演员","3":"白领","4":"网络红人","5":"微商","6":"导游","7":"网购","8":"营销","9":"策划","11":"娱乐","12":"美容","13":"教师","14":"母婴","15":"公关","16":"管理","17":"记者","18":"医生","19":"自由职业","20":"职员","21":"其他"};
	var education_degree = {"1":"初中","2":"高中\/中专","3":"大专","4":"本科","5":"双学士","6":"硕士","7":"博士"};
	var industry_main = {"1":"生活服务","2":"办公文教","3":"房地产建筑装修","4":"服装","20":"通讯服务设备","21":"游戏","22":"互联网","24":"软件","5":"电脑服务","6":"家居生活","7":"家用电器","8":"教育培训","9":"金融","10":"旅游","11":"护肤彩妆","12":"母婴儿童","13":"商务服务","14":"食品饮料","15":"手机数码与消费电子","16":"体育健身","17":"鞋帽箱包配饰","18":"休闲娱乐","19":"医疗保健","26":"节能环保","27":"交通","28":"化工原料制品","29":"机械设备","30":"电气电工","31":"农林牧渔","32":"安全安保","33":"法律服务","34":"招商加盟","35":"工业品"};
	var industry_main_type = {"1":{"1000":"家电维修","1001":"休闲娱乐","1002":"家政","1003":"婚恋交友","1004":"婚庆服务","1005":"宠物","1006":"租车","1007":"餐饮","1008":"美容美发","1009":"面包蛋糕","1010":"星座\/算命","1011":"卡券消费","1012":"生活超市","1013":"车辆养护","1014":"开锁","1015":"搬家","1016":"电视购物类","1017":"物业服务"},"2":{"2000":"办公设备","2001":"文具","2002":"教具"},"3":{"3000":"建筑工程","3001":"房屋租售","3002":"装修服务"},"4":{"4000":"服装","4001":"内衣"},"5":{"5000":"电脑硬件","5001":"网络设备","5002":"电脑周边","5003":"电脑服务","5004":"网络存储","5005":"域名空间","5006":"网站建设"},"6":{"6000":"家居建材","6001":"家具","6002":"家纺家饰","6003":"厨具餐具","6004":"清洁用品","6005":"杯具"},"7":{"7000":"大型家电","7001":"厨用电器","7002":"卫浴家电","7003":"健康电器","7004":"生活小家电"},"8":{"8000":"职业培训","8001":"学前教育","8002":"小初高教育","8003":"高教自考","8004":"留学","8005":"IT培训","8006":"语言培训","8007":"文体培训","8008":"特殊人群教育","8009":"企业培训"},"9":{"9000":"理财","9001":"银行\/银行产品","9002":"保险","9003":"P2P 网贷平台","9004":"典当","9005":"股票","9006":"基金","9007":"证券","9008":"期货外汇","9009":"贵金属","9010":"担保","9011":"投资咨询","9012":"信托","9013":"资产管理\/交易","9014":"融资租赁","9015":"现货交易","9016":"金融综合平台"},"10":{"10000":"旅行社","10001":"酒店住宿","10002":"票务预订（除机票外）","10003":"文体票务","10004":"机票预订","10005":"景点"},"11":{"11000":"保养护肤","11001":"彩妆","11002":"美发护发","11003":"香水","11004":"功能化妆品"},"12":{"12000":"宝宝用品","12001":"育儿网站","12002":"童装","12003":"孕妇用品","12004":"宝宝食品","12005":"儿童玩具"},"13":{"13000":"策划咨询","13001":"快递物流","13002":"招聘","13003":"设计","13004":"广告","13005":"会计税务审计","13006":"代理","13007":"留学中介","13008":"移民中介","13009":"调查","13010":"拍卖","13011":"公关","13012":"配音","13013":"翻译","13014":"会展"},"14":{"14000":"粮油米面调味品","14001":"休闲零食","14002":"茶\/饮料","14003":"酒","14004":"水果蔬菜","14005":"有机食品","14006":"烟"},"15":{"15000":"手机","15001":"相机\/DV","15002":"电玩学习机","15003":"数码配件","15004":"随身影音","15005":"智能家居设备"},"16":{"16000":"运动健身","16001":"运动户外"},"17":{"17000":"帽子","17001":"箱包","17002":"饰品","17003":"鞋","17004":"珠宝钻石","17005":"手表","17006":"皮具"},"18":{"18000":"彩票","18001":"电影","18002":"电视","18003":"演出","18004":"音像影视","18005":"书籍杂志","18006":"动漫游戏周边\/桌游","18007":"摄影","18008":"爱好收藏","18009":"乐器","18010":"鲜花园艺","18011":"个性定制"},"19":{"19000":"保健食品","19001":"美容整形","19002":"综合医院","19003":"药品交易","19004":"保健用品","19005":"美容减肥保健用品","19006":"美容减肥保健食品","19007":"男科","19008":"妇科","19009":"专科医院","19010":"中医","19011":"体检机构","19012":"心理健康","19013":"药品生产研发","19014":"药品信息","19015":"医疗器械生产","19016":"医疗器械销售","19017":"假肢生产装配"},"20":{"20000":"通讯服务","20001":"通讯设备"},"21":{"21000":"游戏开发","21001":"游戏运营","21002":"游戏周边"},"22":{"22000":"网上商城","22001":"导购网站","22002":"团购网站","22003":"社交平台","22004":"分类服务平台","22005":"生活服务网站","22006":"休闲娱乐网站","22007":"门户社区","22008":"视频网站","22009":"第三方支付平台"},"24":{"24000":"应用软件","24001":"操作系统","24002":"中间件软件","24003":"杀毒软件","24004":"监控安全软件","24005":"数据库软件","24006":"企业软件","24007":"行业专用软件","24008":"支付结算软件","24009":"教学软件"},"26":{"26000":"污染处理","26001":"废旧回收","26002":"节能设备","26003":"环保设备","26004":"环境评测"},"27":{"27000":"汽车","27001":"火车","27002":"船舶","27003":"飞机"},"28":{"28000":"纺织原料","28001":"涂料","28002":"化工原料","28003":"橡胶","28004":"塑料","28005":"能源","28006":"冶金","28007":"包装材料"},"29":{"29000":"通用机械设备","29001":"通用零配件","29002":"建筑工程机械","29003":"勘探机械","29004":"化工机械","29005":"木材石材加工机械","29006":"印刷机械","29007":"模具","29008":"食品机械","29009":"农林机械","29010":"纸制造加工设备","29011":"制鞋纺织机械","29012":"商业设备","29013":"包装机械","29014":"制药设备","29015":"冶炼铸造设备","29016":"机床机械","29017":"五金工具","29018":"物流设备","29019":"清洁通风设备","29020":"焊接材料设备","29021":"玻璃橡塑设备","29022":"金属材料","29023":"电子产品制造设备"},"30":{"30000":"电子元器件","30001":"电机设备","30002":"电线电缆","30003":"供电设备","30004":"照明设备","30005":"仪器仪表","30006":"电气设备"},"31":{"31000":"兽医兽药","31001":"农药","31002":"化肥","31003":"养殖","31004":"种植","31005":"园林景观"},"32":{"32000":"安保服务","32001":"安保器材","32002":"安全防伪","32003":"防盗报警","32004":"交通消防","32005":"智能楼宇"},"33":{"33000":"司法鉴定","33001":"律师事务所","33002":"公证"},"34":{"34000":"美容减肥加盟","34001":"餐饮服务加盟","34002":"教育培训加盟","34003":"医药保健加盟","34004":"汽车产品加盟","34005":"服装饰品加盟","34006":"礼品加盟","34007":"生活服务加盟","34008":"机械电子建材加盟","34009":"旅游住宿加盟","34010":"干洗加盟","34011":"养殖加盟","34012":"综合招商加盟"},"35":{"35000":"精细化工"}};
	var address_province = {"34":"安徽","11":"北京","50":"重庆","35":"福建","62":"甘肃","44":"广东","45":"广西","52":"贵州","46":"海南","13":"河北","23":"黑龙江","41":"河南","42":"湖北","43":"湖南","15":"内蒙古","32":"江苏","36":"江西","22":"吉林","21":"辽宁","64":"宁夏","63":"青海","14":"山西","37":"山东","31":"上海","51":"四川","12":"天津","54":"西藏","65":"新疆","53":"云南","33":"浙江","61":"陕西","71":"台湾地区","81":"香港地区","82":"澳门地区","400":"海外","100":"其他"};
	var address_province_city = {"34":{"1":"合肥","2":"芜湖","3":"蚌埠","4":"淮南","5":"马鞍山","6":"淮北","7":"铜陵","8":"安庆","10":"黄山","11":"滁州","12":"阜阳","13":"宿州","14":"巢湖","15":"六安","16":"亳州","17":"池州","18":"宣城"},"11":{"1":"东城区","2":"西城区","3":"崇文区","4":"宣武区","5":"朝阳区","6":"丰台区","7":"石景山区","8":"海淀区","9":"门头沟区","11":"房山区","12":"通州区","13":"顺义区","14":"昌平区","15":"大兴区","16":"怀柔区","17":"平谷区","28":"密云县","29":"延庆县"},"50":{"1":"万州区","2":"涪陵区","3":"渝中区","4":"大渡口区","5":"江北区","6":"沙坪坝区","7":"九龙坡区","8":"南岸区","9":"北碚区","10":"万盛经济技术开发区","11":"双桥经济技术开发区","12":"渝北区","13":"巴南区","14":"黔江区","15":"长寿区","22":"綦江区","23":"潼南县","24":"铜梁区","25":"大足区","26":"荣昌县","27":"璧山区","28":"梁平县","29":"城口县","30":"丰都县","31":"垫江县","32":"武隆县","33":"忠县","34":"开县","35":"云阳县","36":"奉节县","37":"巫山县","38":"巫溪县","40":"石柱土家族自治县","41":"秀山土家族苗族自治县","42":"酉阳土家族苗族自治县","43":"彭水苗族土家族自治县","81":"江津区","82":"合川区","83":"永川区","84":"南川区"},"35":{"1":"福州","2":"厦门","3":"莆田","4":"三明","5":"泉州","6":"漳州","7":"南平","8":"龙岩","9":"宁德"},"62":{"1":"兰州","2":"嘉峪关","3":"金昌","4":"白银","5":"天水","6":"武威","7":"张掖","8":"平凉","9":"酒泉","10":"庆阳","24":"定西","26":"陇南","29":"临夏","30":"甘南"},"44":{"1":"广州","2":"韶关","3":"深圳","4":"珠海","5":"汕头","6":"佛山","7":"江门","8":"湛江","9":"茂名","12":"肇庆","13":"惠州","14":"梅州","15":"汕尾","16":"河源","17":"阳江","18":"清远","19":"东莞","20":"中山","51":"潮州","52":"揭阳","53":"云浮"},"45":{"1":"南宁","22":"柳州","3":"桂林","4":"梧州","5":"北海","6":"防城港","7":"钦州","8":"贵港","9":"玉林","10":"百色","11":"贺州","12":"河池","13":"来宾","14":"崇左"},"52":{"1":"贵阳","2":"六盘水","3":"遵义","4":"安顺","22":"铜仁","23":"黔西南","24":"毕节","26":"黔东南","27":"黔南"},"46":{"1":"海口","2":"三亚","90":"其他"},"13":{"1":"石家庄","2":"唐山","3":"秦皇岛","4":"邯郸","5":"邢台","6":"保定","7":"张家口","8":"承德","9":"沧州","10":"廊坊","11":"衡水"},"23":{"1":"哈尔滨","2":"齐齐哈尔","3":"鸡西","4":"鹤岗","5":"双鸭山","6":"大庆","7":"伊春","8":"佳木斯","9":"七台河","10":"牡丹江","11":"黑河","12":"绥化","27":"大兴安岭"},"41":{"1":"郑州","2":"开封","3":"洛阳","4":"平顶山","5":"安阳","6":"鹤壁","7":"新乡","8":"焦作","9":"濮阳","10":"许昌","11":"漯河","12":"三门峡","13":"南阳","14":"商丘","15":"信阳","16":"周口","17":"驻马店","18":"济源"},"42":{"1":"武汉","2":"黄石","3":"十堰","5":"宜昌","6":"襄阳","7":"鄂州","8":"荆门","9":"孝感","10":"荆州","11":"黄冈","12":"咸宁","13":"随州","28":"恩施土家族苗族自治州","29":"仙桃","30":"潜江","31":"天门","32":"神农架"},"43":{"1":"长沙","2":"株洲","3":"湘潭","4":"衡阳","5":"邵阳","6":"岳阳","7":"常德","8":"张家界","9":"益阳","10":"郴州","11":"永州","12":"怀化","13":"娄底","31":"湘西土家族苗族自治州"},"15":{"1":"呼和浩特","2":"包头","3":"乌海","4":"赤峰","5":"通辽","6":"鄂尔多斯","7":"呼伦贝尔","22":"兴安盟","25":"锡林郭勒盟","26":"乌兰察布","28":"巴彦淖尔","29":"阿拉善盟"},"32":{"1":"南京","2":"无锡","3":"徐州","4":"常州","5":"苏州","6":"南通","7":"连云港","8":"淮安","9":"盐城","10":"扬州","11":"镇江","12":"泰州","13":"宿迁"},"36":{"1":"南昌","2":"景德镇","3":"萍乡","4":"九江","5":"新余","6":"鹰潭","7":"赣州","8":"吉安","9":"宜春","10":"抚州","11":"上饶"},"22":{"1":"长春","2":"吉林","3":"四平","4":"辽源","5":"通化","6":"白山","7":"松原","8":"白城","24":"延边朝鲜族自治州"},"21":{"1":"沈阳","2":"大连","3":"鞍山","4":"抚顺","5":"本溪","6":"丹东","7":"锦州","8":"营口","9":"阜新","10":"辽阳","11":"盘锦","12":"铁岭","13":"朝阳","14":"葫芦岛"},"64":{"1":"银川","2":"石嘴山","3":"吴忠","4":"固原","5":"中卫"},"63":{"1":"西宁","21":"海东","22":"海北","23":"黄南","25":"海南","26":"果洛","27":"玉树","28":"海西"},"14":{"1":"西宁","21":"海东","22":"海北","23":"黄南","25":"海南","26":"果洛","27":"玉树","28":"海西"},"37":{"1":"济南","2":"青岛","3":"淄博","4":"枣庄","5":"东营","6":"烟台","7":"潍坊","8":"济宁","9":"泰安","10":"威海","11":"日照","12":"莱芜","13":"临沂","14":"德州","15":"聊城","16":"滨州","17":"菏泽"},"31":{"1":"黄浦区","3":"卢湾区","4":"徐汇区","5":"长宁区","6":"静安区","7":"普陀区","8":"闸北区","9":"虹口区","10":"杨浦区","12":"闵行区","13":"宝山区","14":"嘉定区","15":"浦东新区","16":"金山区","17":"松江区","18":"青浦区","19":"南汇区","20":"奉贤区","30":"崇明县"},"51":{"1":"成都","3":"自贡","4":"攀枝花","5":"泸州","6":"德阳","7":"绵阳","8":"广元","9":"遂宁","10":"内江","11":"乐山","13":"南充","14":"眉山","15":"宜宾","16":"广安","17":"达州","18":"雅安","19":"巴中","20":"资阳","32":"阿坝","33":"甘孜","34":"凉山"},"12":{"1":"和平区","2":"河东区","3":"河西区","4":"南开区","5":"河北区","6":"红桥区","7":"塘沽区","8":"汉沽区","9":"大港区","10":"东丽区","11":"西青区","12":"津南区","13":"北辰区","14":"武清区","15":"宝坻区","21":"宁河县","23":"静海县","25":"蓟县","26":"滨海新区","27":"保税区"},"54":{"1":"拉萨","21":"昌都","22":"山南","23":"日喀则","24":"那曲","25":"阿里","26":"林芝"},"65":{"1":"乌鲁木齐","2":"克拉玛依","21":"吐鲁番","22":"哈密","23":"昌吉","27":"博尔塔拉","28":"巴音郭楞","29":"阿克苏","30":"克孜勒苏","31":"喀什","32":"和田","40":"伊犁","42":"塔城","43":"阿勒泰","44":"石河子"},"53":{"1":"昆明","3":"曲靖","4":"玉溪","5":"保山","6":"昭通","23":"楚雄","25":"红河","26":"文山","27":"普洱","28":"西双版纳","29":"大理","31":"德宏","32":"丽江","33":"怒江","34":"迪庆","35":"临沧"},"33":{"1":"杭州","2":"宁波","3":"温州","4":"嘉兴","5":"湖州","6":"绍兴","7":"金华","8":"衢州","9":"舟山","10":"台州","11":"丽水"},"61":{"1":"西安","2":"铜川","3":"宝鸡","4":"咸阳","5":"渭南","6":"延安","7":"汉中","8":"榆林","9":"安康","10":"商洛"},"71":{"1":"台北市","2":"高雄市","3":"基隆市","4":"台中市","5":"台南市","6":"新竹市","7":"嘉义市","8":"新北市","9":"宜兰县","10":"桃园县","11":"新竹县","12":"苗栗县","13":"台中县","14":"彰化县","15":"南投县","16":"云林县","17":"嘉义县","18":"台南县","19":"高雄县","20":"屏东县","21":"澎湖县","22":"台东县","23":"花莲县","90":"其他"},"81":{"2":"中西区","3":"东区","4":"九龙城区","5":"观塘区","6":"南区","7":"深水埗区","8":"黄大仙区","9":"湾仔区","10":"油尖旺区","11":"离岛区","12":"葵青区","13":"北区","14":"西贡区","15":"沙田区","16":"屯门区","17":"大埔区","18":"荃湾区","19":"元朗区","1":"其他"},"82":{"2":"花地玛堂区","3":"圣安多尼堂区","4":"大堂区","5":"望德堂区","6":"风顺堂区","7":"氹仔","8":"路环","1":"其他"},"400":{"1":"美国","2":"英国","3":"法国","4":"俄罗斯","5":"加拿大","6":"巴西","7":"澳大利亚","8":"印尼","9":"泰国","10":"马来西亚","11":"新加坡","12":"菲律宾","13":"越南","14":"印度","15":"日本","17":"新西兰","18":"韩国","19":"德国","20":"意大利","21":"爱尔兰","22":"荷兰","23":"瑞士","24":"乌克兰","25":"南非","26":"芬兰","27":"瑞典","28":"奥地利","29":"西班牙","30":"比利时","31":"挪威","32":"丹麦","33":"波兰","34":"阿根廷","35":"白俄罗斯","36":"哥伦比亚","37":"古巴","38":"埃及","39":"希腊","40":"匈牙利","41":"伊朗","42":"蒙古","43":"墨西哥","44":"葡萄牙","45":"沙特阿拉伯","46":"土耳其","16":"其他"},"100":{"1":"其他"}};
	var res_paper_pages = ["新闻版","其他版","汽车版","经济版","资讯版","3C\/IT版","社区版","普通版"];
	var res_paper_media_type = ["综合","新闻","财经","汽车","时尚","IT","生活"];
	var res_paper_publish_date = {"0":"周一","1":"周二","2":"周三","3":"周四","4":"周五","5":"周六","7":"周日","8":"双周","9":"月刊","10":"双月","11":"日报"};
	var express = {"1":"顺丰","2":"圆通","3":"中通","4":"韵达"};
	var res_article_form = ["文字标题","文字链","通栏","图文混排","导航栏定制","焦点图片","其他图片","Banner","视频","全屏广告","画中画","Button","Floating","流媒体"];
	var res_article_level = ["列表页入口","三级频道首页","无入口","频道首页","网站首页","二级频道首页"];
	var res_article_web_status = ["全国门户","垂直行业","地方门户"];
	var res_article_channel_status = ["娱乐","财经","教育","生活","消费","时尚","汽车","女性","其他","游戏","公益","体育","旅游","房产","文化","地方","电子商务","资讯","食品","育儿","金融","美容","服装","商讯","法律","家电数码","通信","全国\/地方门户\/垂直行业","环保","购物","工业资讯","新闻","家居","健康","科技"];
	var res_article_content_type = {"1":"外部链接","2":"上传文档","3":"内部编辑"};
	var res_star_profession = {"1":"影视演员","2":"歌手","3":"模特","4":"主持人","5":"段子手","6":"作家","7":"音乐人","8":"美容护肤达人","9":"体育人","10":"网络红人","11":"游戏动漫达人","12":"漫画家","13":"造型师","14":"记者","15":"商界名人","16":"营销专家","17":"童星","18":"舞蹈家","19":"美食家","20":"娱评人","21":"相声曲艺","22":"汽车达人","23":"设计师","24":"教育家","25":"财经专家","26":"情感专家","27":"养生专家","28":"医生","29":"母婴专家","30":"数码达人","31":"网购达人","32":"收藏家","33":"男优\/女优","34":"风水师","35":"房地产","36":"摄影师","37":"影视幕后","38":"IT名人","39":"时尚达人","40":"旅游达人"};
	var res_star_category = {"1":"创意\/生活","2":"新闻时政","3":"IT\/互联网","4":"综合媒体","5":"服饰搭配","6":"财经","7":"时尚","8":"美食","9":"导购促销","10":"旅游","11":"文艺\/教育","12":"美容化妆","13":"影视","14":"母婴","15":"养生\/健康","16":"情感心理","17":"游戏\/动漫","18":"音乐","19":"数码","20":"营销","21":"摄影","22":"商务\/管理","23":"体育","24":"手机应用","25":"房地产","26":"奢侈品妆","27":"军事","28":"娱乐八卦","29":"汽车"};
	var res_star_hobby = {"1":"影视","2":"音乐","3":"新闻","4":"美食","5":"情感","6":"文字","7":"时尚","8":"美容","9":"公益","10":"旅游","11":"烟酒","12":"数码","13":"体育","14":"购物","15":"宠物","16":"游戏","17":"摄影","18":"教育","19":"家居","20":"养生","21":"汽车","22":"房产","23":"母婴","24":"互联网"};
	var res_star_cooperate_type = {"1":"微信发文","2":"长期合作","3":"线下活动","4":"创意制作","5":"联合搞活动","6":"其他合作","7":"直发微博","8":"转发微博"};
	var res_star_plate = {"1":"微信朋友圈","2":"新浪微博","3":"微信公众号"};
	var auth_status = ["未审核","审核通过","审核不通过","审核中"];
	var ad_auth_status = ["未认证","认证通过","认证中","认证不通过"];
	var appoint_status = {"1":"草稿","2":"审核中","3":"待付款","4":"执行中","5":"审核不通过","6":"已完成"};
	var appoint_order_status = {"1":"审稿中","2":"执行中","3":"稿件不通过","4":"拒单","5":"预约中","6":"待付款","7":"完成"};
	var res_star_order_status = {"1":"需求描述审核中","2":"需求描述审核不通过","3":"执行内容审核中","4":"执行内容审核不通过","5":"待付款","6":"拒单","7":"执行中","8":"质检中","9":"完成"};
	var ad_type = {"1":"直发","2":"转发","3":"分享"};
	var ad_soft_hard = {"1":"硬广","2":"软广"};
	var zmt_account_is_on = ["下架","上架"];
	var gender = ["女","男"];
	var activity_type = {"1":"新浪微博","2":"微信公众号","3":"朋友圈","4":"网络软文","5":"纸媒预约","6":"预约大号"};
	var wechat_slot = {"1":"单图文","2":"多图文第一条","3":"多图文第二条","4":"多图文第N条"};
	var task_status = {"1":"草稿","2":"待执行","3":"派单中","4":"质检中","5":"已完成","6":"取消"};
	var task_item_status = ["未开始","未派单","拒单","流单","派单中","质检中","完成","叫停","未审核","确定接单"];
	var qa_status = ["未质检","质检合格","质检不合格","复检","复检不合格","质检终止"];
	var active_task_type = {"1":"直发","2":"转发","3":"分享"};
	var refused_reson = {"1":"时间","2":"内容","3":"其它"};
	var qa_type = ["未开始质检","执行截图质检","数据截图质检","佣金结算"];
	var zmt_action = {"3":"接单\/拒单","4":"上传执行截图","8":"重新上传执行截图","16":"上传数据截图","32":"重新上传数据截图"};
	var bill_type = {"1":"消费","2":"充值","3":"冻结"};
	var invoice_type = {"1":"普通发票","2":"增值税发票","3":"扣税发票"};
	var invoice_status = ["申请开票","同意开票","拒绝开票","开票完成"];
	var invoice_title = {"1":"个人","2":"公司"};
	var deposit_type = {"1":"支付宝","2":"银行卡"};
	var recharge_mode_type = {"1":"支付宝","2":"微信","3":"工商银行企业","4":"建设银行企业","5":"农业银行企业","6":"招商银行企业","7":"浦发银行企业","8":"中国银行企业","9":"银联支付"};
	var bill_recharge_type = ["后台打款充值","支付宝","微信","工商银行企业","建设银行企业","农业银行企业","招商银行企业","浦发银行企业","中国银行企业","银联支付"];
	var is_invoice = ["未开发票","已开发票"];
	var is_on = ["下架","上架"];
	var user_type = {"1":"广告主","2":"自媒体","3":"管理员"};
	var admin_control = {"1":"商户后台","2":"派单管理","4":"订单管理","8":"预约资源","16":"广告主","32":"自媒体","64":"财务管理","128":"后台管理"};
	var admin_control_action = {"1":{"2048":"数据展示"},"2":{"4096":"派单数据"},"4":{"8192":"质检操作"},"8":{"16384":"资源操作"},"16":{"32768":"质检审批","65536":"用户敏感信息"},"32":{"131072":"资源审核","262144":"数据修改"},"64":{"524288":"财务操作","1048576":"财务日志"},"128":{"2097152":"管理员添加\/修改","4194304":"管理员组添加\/修改"}};
	var admin_pow_desc = {"1":"[数据展示]:是否显示一些重要敏感信息","2":"[派单数据]:查看用户所有派单数据,派单详情,派单审批操作","4":"[质检操作]:订单质检操作","8":"[资源操作]:预约资源的操作权限","16":"[用户敏感信息]:广告主用户的敏感信息,用户余额等","32":"[资源审核]:自媒体用户资源审核操作,[数据修改]:自媒体用户的数据修改权限","64":"[财务操作]:财务操作权限,[财务日志]:查看财务操作的日志权限","128":"[管理员添加\/修改]:管理员添加修改删除权限,[管理员组添加\/修改]:管理员组的添加修改删除权限"};
	var user_ad_log_type = {"1":"注册","2":"资质填回","3":"审核资质","4":"充值","5":"派单","6":"预约","7":"派单审核","8":"订单接单","9":"订单执行","10":"订单回填","11":"订单质检","12":"运营人员回访记录"};
	var zmt_log_type = {"1":"注册"};
	var provide_bill = ["未知","不提供","提供"];

	static.weibo_cate = function(){ return weibo_cate; };
	static.weibo_cate_get = function( i, def_value ){ 
		def_value = def_value || "未知";
		if ( !weibo_cate[ i ] )
		{
			return def_value;
		}
		return weibo_cate[ i ];
	};
	static.wechat_official_cate = function(){ return wechat_official_cate; };
	static.wechat_official_cate_get = function( i, def_value ){ 
		def_value = def_value || "未知";
		if ( !wechat_official_cate[ i ] )
		{
			return def_value;
		}
		return wechat_official_cate[ i ];
	};
	static.wechat_cate = function(){ return wechat_cate; };
	static.wechat_cate_get = function( i, def_value ){ 
		def_value = def_value || "未知";
		if ( !wechat_cate[ i ] )
		{
			return def_value;
		}
		return wechat_cate[ i ];
	};
	static.wechat_job = function(){ return wechat_job; };
	static.wechat_job_get = function( i, def_value ){ 
		def_value = def_value || "未知";
		if ( !wechat_job[ i ] )
		{
			return def_value;
		}
		return wechat_job[ i ];
	};
	static.education_degree = function(){ return education_degree; };
	static.education_degree_get = function( i, def_value ){ 
		def_value = def_value || "未知";
		if ( !education_degree[ i ] )
		{
			return def_value;
		}
		return education_degree[ i ];
	};
	static.industry_main = function(){ return industry_main; };
	static.industry_main_get = function( i, def_value ){ 
		def_value = def_value || "未知";
		if ( !industry_main[ i ] )
		{
			return def_value;
		}
		return industry_main[ i ];
	};
	static.industry_main_type = function(j){ return industry_main_type[ j ]; };
	static.industry_main_type_get = function( i, j, def_value ){ 
		def_value = def_value || "未知";
		if ( !industry_main_type[ i ] )
		{
			return def_value;
		}
		if ( !industry_main_type[ i ][ j ] )
		{
			return def_value;
		}
		return industry_main_type[ i ][ j ];
	};
	static.address_province = function(){ return address_province; };
	static.address_province_get = function( i, def_value ){ 
		def_value = def_value || "未知";
		if ( !address_province[ i ] )
		{
			return def_value;
		}
		return address_province[ i ];
	};
	static.address_province_city = function(j){ return address_province_city[ j ]; };
	static.address_province_city_get = function( i, j, def_value ){ 
		def_value = def_value || "未知";
		if ( !address_province_city[ i ] )
		{
			return def_value;
		}
		if ( !address_province_city[ i ][ j ] )
		{
			return def_value;
		}
		return address_province_city[ i ][ j ];
	};
	static.res_paper_pages = function(){ return res_paper_pages; };
	static.res_paper_pages_get = function( i, def_value ){ 
		def_value = def_value || "未知";
		if ( !res_paper_pages[ i ] )
		{
			return def_value;
		}
		return res_paper_pages[ i ];
	};
	static.res_paper_media_type = function(){ return res_paper_media_type; };
	static.res_paper_media_type_get = function( i, def_value ){ 
		def_value = def_value || "未知";
		if ( !res_paper_media_type[ i ] )
		{
			return def_value;
		}
		return res_paper_media_type[ i ];
	};
	static.res_paper_publish_date = function(){ return res_paper_publish_date; };
	static.res_paper_publish_date_get = function( i, def_value ){ 
		def_value = def_value || "未知";
		if ( !res_paper_publish_date[ i ] )
		{
			return def_value;
		}
		return res_paper_publish_date[ i ];
	};
	static.express = function(){ return express; };
	static.express_get = function( i, def_value ){ 
		def_value = def_value || "未知";
		if ( !express[ i ] )
		{
			return def_value;
		}
		return express[ i ];
	};
	static.res_article_form = function(){ return res_article_form; };
	static.res_article_form_get = function( i, def_value ){ 
		def_value = def_value || "未知";
		if ( !res_article_form[ i ] )
		{
			return def_value;
		}
		return res_article_form[ i ];
	};
	static.res_article_level = function(){ return res_article_level; };
	static.res_article_level_get = function( i, def_value ){ 
		def_value = def_value || "未知";
		if ( !res_article_level[ i ] )
		{
			return def_value;
		}
		return res_article_level[ i ];
	};
	static.res_article_web_status = function(){ return res_article_web_status; };
	static.res_article_web_status_get = function( i, def_value ){ 
		def_value = def_value || "未知";
		if ( !res_article_web_status[ i ] )
		{
			return def_value;
		}
		return res_article_web_status[ i ];
	};
	static.res_article_channel_status = function(){ return res_article_channel_status; };
	static.res_article_channel_status_get = function( i, def_value ){ 
		def_value = def_value || "未知";
		if ( !res_article_channel_status[ i ] )
		{
			return def_value;
		}
		return res_article_channel_status[ i ];
	};
	static.res_article_content_type = function(){ return res_article_content_type; };
	static.res_article_content_type_get = function( i, def_value ){ 
		def_value = def_value || "未知";
		if ( !res_article_content_type[ i ] )
		{
			return def_value;
		}
		return res_article_content_type[ i ];
	};
	static.res_star_profession = function(){ return res_star_profession; };
	static.res_star_profession_get = function( i, def_value ){ 
		def_value = def_value || "未知";
		if ( !res_star_profession[ i ] )
		{
			return def_value;
		}
		return res_star_profession[ i ];
	};
	static.res_star_category = function(){ return res_star_category; };
	static.res_star_category_get = function( i, def_value ){ 
		def_value = def_value || "未知";
		if ( !res_star_category[ i ] )
		{
			return def_value;
		}
		return res_star_category[ i ];
	};
	static.res_star_hobby = function(){ return res_star_hobby; };
	static.res_star_hobby_get = function( i, def_value ){ 
		def_value = def_value || "未知";
		if ( !res_star_hobby[ i ] )
		{
			return def_value;
		}
		return res_star_hobby[ i ];
	};
	static.res_star_cooperate_type = function(){ return res_star_cooperate_type; };
	static.res_star_cooperate_type_get = function( i, def_value ){ 
		def_value = def_value || "未知";
		if ( !res_star_cooperate_type[ i ] )
		{
			return def_value;
		}
		return res_star_cooperate_type[ i ];
	};
	static.res_star_plate = function(){ return res_star_plate; };
	static.res_star_plate_get = function( i, def_value ){ 
		def_value = def_value || "未知";
		if ( !res_star_plate[ i ] )
		{
			return def_value;
		}
		return res_star_plate[ i ];
	};
	static.auth_status = function(){ return auth_status; };
	static.auth_status_get = function( i, def_value ){ 
		def_value = def_value || "未知";
		if ( !auth_status[ i ] )
		{
			return def_value;
		}
		return auth_status[ i ];
	};
	static.ad_auth_status = function(){ return ad_auth_status; };
	static.ad_auth_status_get = function( i, def_value ){ 
		def_value = def_value || "未知";
		if ( !ad_auth_status[ i ] )
		{
			return def_value;
		}
		return ad_auth_status[ i ];
	};
	static.appoint_status = function(){ return appoint_status; };
	static.appoint_status_get = function( i, def_value ){ 
		def_value = def_value || "未知";
		if ( !appoint_status[ i ] )
		{
			return def_value;
		}
		return appoint_status[ i ];
	};
	static.appoint_order_status = function(){ return appoint_order_status; };
	static.appoint_order_status_get = function( i, def_value ){ 
		def_value = def_value || "未知";
		if ( !appoint_order_status[ i ] )
		{
			return def_value;
		}
		return appoint_order_status[ i ];
	};
	static.res_star_order_status = function(){ return res_star_order_status; };
	static.res_star_order_status_get = function( i, def_value ){ 
		def_value = def_value || "未知";
		if ( !res_star_order_status[ i ] )
		{
			return def_value;
		}
		return res_star_order_status[ i ];
	};
	static.ad_type = function(){ return ad_type; };
	static.ad_type_get = function( i, def_value ){ 
		def_value = def_value || "未知";
		if ( !ad_type[ i ] )
		{
			return def_value;
		}
		return ad_type[ i ];
	};
	static.ad_soft_hard = function(){ return ad_soft_hard; };
	static.ad_soft_hard_get = function( i, def_value ){ 
		def_value = def_value || "未知";
		if ( !ad_soft_hard[ i ] )
		{
			return def_value;
		}
		return ad_soft_hard[ i ];
	};
	static.zmt_account_is_on = function(){ return zmt_account_is_on; };
	static.zmt_account_is_on_get = function( i, def_value ){ 
		def_value = def_value || "未知";
		if ( !zmt_account_is_on[ i ] )
		{
			return def_value;
		}
		return zmt_account_is_on[ i ];
	};
	static.gender = function(){ return gender; };
	static.gender_get = function( i, def_value ){ 
		def_value = def_value || "未知";
		if ( !gender[ i ] )
		{
			return def_value;
		}
		return gender[ i ];
	};
	static.activity_type = function(){ return activity_type; };
	static.activity_type_get = function( i, def_value ){ 
		def_value = def_value || "未知";
		if ( !activity_type[ i ] )
		{
			return def_value;
		}
		return activity_type[ i ];
	};
	static.wechat_slot = function(){ return wechat_slot; };
	static.wechat_slot_get = function( i, def_value ){ 
		def_value = def_value || "未知";
		if ( !wechat_slot[ i ] )
		{
			return def_value;
		}
		return wechat_slot[ i ];
	};
	static.task_status = function(){ return task_status; };
	static.task_status_get = function( i, def_value ){ 
		def_value = def_value || "未知";
		if ( !task_status[ i ] )
		{
			return def_value;
		}
		return task_status[ i ];
	};
	static.task_item_status = function(){ return task_item_status; };
	static.task_item_status_get = function( i, def_value ){ 
		def_value = def_value || "未知";
		if ( !task_item_status[ i ] )
		{
			return def_value;
		}
		return task_item_status[ i ];
	};
	static.qa_status = function(){ return qa_status; };
	static.qa_status_get = function( i, def_value ){ 
		def_value = def_value || "未知";
		if ( !qa_status[ i ] )
		{
			return def_value;
		}
		return qa_status[ i ];
	};
	static.active_task_type = function(){ return active_task_type; };
	static.active_task_type_get = function( i, def_value ){ 
		def_value = def_value || "未知";
		if ( !active_task_type[ i ] )
		{
			return def_value;
		}
		return active_task_type[ i ];
	};
	static.refused_reson = function(){ return refused_reson; };
	static.refused_reson_get = function( i, def_value ){ 
		def_value = def_value || "未知";
		if ( !refused_reson[ i ] )
		{
			return def_value;
		}
		return refused_reson[ i ];
	};
	static.qa_type = function(){ return qa_type; };
	static.qa_type_get = function( i, def_value ){ 
		def_value = def_value || "未知";
		if ( !qa_type[ i ] )
		{
			return def_value;
		}
		return qa_type[ i ];
	};
	static.zmt_action = function(){ return zmt_action; };
	static.zmt_action_get = function( i, def_value ){ 
		def_value = def_value || "未知";
		if ( !zmt_action[ i ] )
		{
			return def_value;
		}
		return zmt_action[ i ];
	};
	static.bill_type = function(){ return bill_type; };
	static.bill_type_get = function( i, def_value ){ 
		def_value = def_value || "未知";
		if ( !bill_type[ i ] )
		{
			return def_value;
		}
		return bill_type[ i ];
	};
	static.invoice_type = function(){ return invoice_type; };
	static.invoice_type_get = function( i, def_value ){ 
		def_value = def_value || "未知";
		if ( !invoice_type[ i ] )
		{
			return def_value;
		}
		return invoice_type[ i ];
	};
	static.invoice_status = function(){ return invoice_status; };
	static.invoice_status_get = function( i, def_value ){ 
		def_value = def_value || "未知";
		if ( !invoice_status[ i ] )
		{
			return def_value;
		}
		return invoice_status[ i ];
	};
	static.invoice_title = function(){ return invoice_title; };
	static.invoice_title_get = function( i, def_value ){ 
		def_value = def_value || "未知";
		if ( !invoice_title[ i ] )
		{
			return def_value;
		}
		return invoice_title[ i ];
	};
	static.deposit_type = function(){ return deposit_type; };
	static.deposit_type_get = function( i, def_value ){ 
		def_value = def_value || "未知";
		if ( !deposit_type[ i ] )
		{
			return def_value;
		}
		return deposit_type[ i ];
	};
	static.recharge_mode_type = function(){ return recharge_mode_type; };
	static.recharge_mode_type_get = function( i, def_value ){ 
		def_value = def_value || "未知";
		if ( !recharge_mode_type[ i ] )
		{
			return def_value;
		}
		return recharge_mode_type[ i ];
	};
	static.bill_recharge_type = function(){ return bill_recharge_type; };
	static.bill_recharge_type_get = function( i, def_value ){ 
		def_value = def_value || "未知";
		if ( !bill_recharge_type[ i ] )
		{
			return def_value;
		}
		return bill_recharge_type[ i ];
	};
	static.is_invoice = function(){ return is_invoice; };
	static.is_invoice_get = function( i, def_value ){ 
		def_value = def_value || "未知";
		if ( !is_invoice[ i ] )
		{
			return def_value;
		}
		return is_invoice[ i ];
	};
	static.is_on = function(){ return is_on; };
	static.is_on_get = function( i, def_value ){ 
		def_value = def_value || "未知";
		if ( !is_on[ i ] )
		{
			return def_value;
		}
		return is_on[ i ];
	};
	static.user_type = function(){ return user_type; };
	static.user_type_get = function( i, def_value ){ 
		def_value = def_value || "未知";
		if ( !user_type[ i ] )
		{
			return def_value;
		}
		return user_type[ i ];
	};
	static.admin_control = function(){ return admin_control; };
	static.admin_control_get = function( i, def_value ){ 
		def_value = def_value || "未知";
		if ( !admin_control[ i ] )
		{
			return def_value;
		}
		return admin_control[ i ];
	};
	static.admin_control_action = function(j){ return admin_control_action[ j ]; };
	static.admin_control_action_get = function( i, j, def_value ){ 
		def_value = def_value || "未知";
		if ( !admin_control_action[ i ] )
		{
			return def_value;
		}
		if ( !admin_control_action[ i ][ j ] )
		{
			return def_value;
		}
		return admin_control_action[ i ][ j ];
	};
	static.admin_pow_desc = function(){ return admin_pow_desc; };
	static.admin_pow_desc_get = function( i, def_value ){ 
		def_value = def_value || "未知";
		if ( !admin_pow_desc[ i ] )
		{
			return def_value;
		}
		return admin_pow_desc[ i ];
	};
	static.user_ad_log_type = function(){ return user_ad_log_type; };
	static.user_ad_log_type_get = function( i, def_value ){ 
		def_value = def_value || "未知";
		if ( !user_ad_log_type[ i ] )
		{
			return def_value;
		}
		return user_ad_log_type[ i ];
	};
	static.zmt_log_type = function(){ return zmt_log_type; };
	static.zmt_log_type_get = function( i, def_value ){ 
		def_value = def_value || "未知";
		if ( !zmt_log_type[ i ] )
		{
			return def_value;
		}
		return zmt_log_type[ i ];
	};
	static.provide_bill = function(){ return provide_bill; };
	static.provide_bill_get = function( i, def_value ){ 
		def_value = def_value || "未知";
		if ( !provide_bill[ i ] )
		{
			return def_value;
		}
		return provide_bill[ i ];
	};

	smarty.register_modifier( "static_weibo_cate", static.weibo_cate_get );
	smarty.register_modifier( "static_wechat_official_cate", static.wechat_official_cate_get );
	smarty.register_modifier( "static_wechat_cate", static.wechat_cate_get );
	smarty.register_modifier( "static_wechat_job", static.wechat_job_get );
	smarty.register_modifier( "static_education_degree", static.education_degree_get );
	smarty.register_modifier( "static_industry_main", static.industry_main_get );
	smarty.register_modifier( "static_industry_main_type", static.industry_main_type_get );
	smarty.register_modifier( "static_address_province", static.address_province_get );
	smarty.register_modifier( "static_address_province_city", static.address_province_city_get );
	smarty.register_modifier( "static_res_paper_pages", static.res_paper_pages_get );
	smarty.register_modifier( "static_res_paper_media_type", static.res_paper_media_type_get );
	smarty.register_modifier( "static_res_paper_publish_date", static.res_paper_publish_date_get );
	smarty.register_modifier( "static_express", static.express_get );
	smarty.register_modifier( "static_res_article_form", static.res_article_form_get );
	smarty.register_modifier( "static_res_article_level", static.res_article_level_get );
	smarty.register_modifier( "static_res_article_web_status", static.res_article_web_status_get );
	smarty.register_modifier( "static_res_article_channel_status", static.res_article_channel_status_get );
	smarty.register_modifier( "static_res_article_content_type", static.res_article_content_type_get );
	smarty.register_modifier( "static_res_star_profession", static.res_star_profession_get );
	smarty.register_modifier( "static_res_star_category", static.res_star_category_get );
	smarty.register_modifier( "static_res_star_hobby", static.res_star_hobby_get );
	smarty.register_modifier( "static_res_star_cooperate_type", static.res_star_cooperate_type_get );
	smarty.register_modifier( "static_res_star_plate", static.res_star_plate_get );
	smarty.register_modifier( "static_auth_status", static.auth_status_get );
	smarty.register_modifier( "static_ad_auth_status", static.ad_auth_status_get );
	smarty.register_modifier( "static_appoint_status", static.appoint_status_get );
	smarty.register_modifier( "static_appoint_order_status", static.appoint_order_status_get );
	smarty.register_modifier( "static_res_star_order_status", static.res_star_order_status_get );
	smarty.register_modifier( "static_ad_type", static.ad_type_get );
	smarty.register_modifier( "static_ad_soft_hard", static.ad_soft_hard_get );
	smarty.register_modifier( "static_zmt_account_is_on", static.zmt_account_is_on_get );
	smarty.register_modifier( "static_gender", static.gender_get );
	smarty.register_modifier( "static_activity_type", static.activity_type_get );
	smarty.register_modifier( "static_wechat_slot", static.wechat_slot_get );
	smarty.register_modifier( "static_task_status", static.task_status_get );
	smarty.register_modifier( "static_task_item_status", static.task_item_status_get );
	smarty.register_modifier( "static_qa_status", static.qa_status_get );
	smarty.register_modifier( "static_active_task_type", static.active_task_type_get );
	smarty.register_modifier( "static_refused_reson", static.refused_reson_get );
	smarty.register_modifier( "static_qa_type", static.qa_type_get );
	smarty.register_modifier( "static_zmt_action", static.zmt_action_get );
	smarty.register_modifier( "static_bill_type", static.bill_type_get );
	smarty.register_modifier( "static_invoice_type", static.invoice_type_get );
	smarty.register_modifier( "static_invoice_status", static.invoice_status_get );
	smarty.register_modifier( "static_invoice_title", static.invoice_title_get );
	smarty.register_modifier( "static_deposit_type", static.deposit_type_get );
	smarty.register_modifier( "static_recharge_mode_type", static.recharge_mode_type_get );
	smarty.register_modifier( "static_bill_recharge_type", static.bill_recharge_type_get );
	smarty.register_modifier( "static_is_invoice", static.is_invoice_get );
	smarty.register_modifier( "static_is_on", static.is_on_get );
	smarty.register_modifier( "static_user_type", static.user_type_get );
	smarty.register_modifier( "static_admin_control", static.admin_control_get );
	smarty.register_modifier( "static_admin_control_action", static.admin_control_action_get );
	smarty.register_modifier( "static_admin_pow_desc", static.admin_pow_desc_get );
	smarty.register_modifier( "static_user_ad_log_type", static.user_ad_log_type_get );
	smarty.register_modifier( "static_zmt_log_type", static.zmt_log_type_get );
	smarty.register_modifier( "static_provide_bill", static.provide_bill_get );

