<template>
    <div>
        <v-contextmenu ref="contextmenu1" id="contextmenu1">
            <v-contextmenu-item @click="getMenuMeta(data1)">请求元数据</v-contextmenu-item>
            <v-contextmenu-item @click="loadLayer1(data1)">加载</v-contextmenu-item>
            <v-contextmenu-item @click="unloadLayer1(data1)">卸载</v-contextmenu-item>
            <v-contextmenu-item @click="locate1(data1)">定位图层</v-contextmenu-item>
            <v-contextmenu-item @click="upLayer1(data1)">置于顶层</v-contextmenu-item>
            <v-contextmenu-item @click="toggleRange1(data1)">显隐范围</v-contextmenu-item>
        </v-contextmenu>
        <v-contextmenu ref="contextmenu2" id="contextmenu2">
            <v-contextmenu-item @click="getMenuMeta(data1)">请求元数据</v-contextmenu-item>
            <v-contextmenu-item @click="locate1(data1)">定位图层</v-contextmenu-item>
            <v-contextmenu-item @click="upLayer1(data1)">置于顶层</v-contextmenu-item>
            <v-contextmenu-item @click="toggleRange1(data1)">显隐范围</v-contextmenu-item>
        </v-contextmenu>
        <v-contextmenu ref="contextmenu3" id="contextmenu3">
            <v-contextmenu-item @click="getMenuMeta(data1)">请求元数据</v-contextmenu-item>
            <v-contextmenu-item @click="loadLayer1(data1)">加载</v-contextmenu-item>
            <v-contextmenu-item @click="unloadLayer1(data1)">卸载</v-contextmenu-item>
            <v-contextmenu-item @click="locate1(data1)">定位图层</v-contextmenu-item>
            <v-contextmenu-item @click="upLayer1(data1)">置于顶层</v-contextmenu-item>
            <v-contextmenu-item @click="toggleRange1(data1)">显隐范围</v-contextmenu-item>
            <v-contextmenu-item><Icon type="wrench"></Icon>设置要素过滤器</v-contextmenu-item>
        </v-contextmenu>
        <el-tree :data="data"
        :props="defaultProps"
        v-on:node-contextmenu="menuOptions"
        v-on:node-click="getCapabilities"
        ></el-tree>
        <Modal
        v-model="modal1"
        title="元数据">
            <Table border :columns="columns1" :data="tabledata"></Table>
        </Modal>
    </div>
</template>
<script>
export default {
    data(){
        return{
           show_server_tree:true, 
           data: [],
           data1: [],
           defaultProps: {
            children: 'children',
            label: 'label'
           },
           modal1:false,
           columns1 :[
               {
                   title:'元数据名称',
                   key:'title'
               },
               {
                   title:'元数据值',
                   key:'value'
               }
           ],
           tabledata:[]
        }
    },
    mounted(){
        this.getTree();
    },
    methods:{
        getTree:function(){//请求目录树
            var that = this;
            var erroCallback = function(response){
                that.$Message.error({
                    content:"请求目录树失败！",
                    duration: 3
                });
            }
            var successCallback = function(response){
                for(let i = 0;i < response.data.length; i++){
                    for(let j = 0; j < response.data[i]['children'].length; j++){
                        response.data[i]['children'][j]['children'] = [];
                    }
                }
                console.log(response.data);
                var str = JSON.stringify(response.data);
                str = str.replace(/\"title"/g,"\"label\"");
                that.data = JSON.parse(str);
            }
            if(this.show_server_tree){
                console.log("请求服务树");
                this.$http.get(this.GLOBAL.baseUrl + '/services/home').then(successCallback,erroCallback);
            }
            else{
                console.log("请求数据树");
                // this.$http.get(this.GLOBAL.baseUrl + '/services/dataDir').then(successCallback,erroCallback);
            }
        },
        getCapabilities:function(obj,node,component){
            console.log(obj);
            const that = this;
            console.log(obj['lazy']);
            console.log(obj['children']);
            if(obj['lazy'] && obj['children'].length == 0){
                var baseUrl = obj['url'];
                var service = obj['service'];
                var version = obj['version'] || '1.0.0';
                var erroCallback = function(response){
                that.$Message.error({
                    content:"getCapabilities失败！",
                    duration: 3
                });
                }
                var successCallback = function(response){
                    var data = that._parseXml(response.data, service, baseUrl);
                    obj['children'] = data;
                    that.$Message.success({
                        content:"成功！",
                        duration: 3
                    });
                }
                var url = baseUrl + '?service={service}&request=getCapabilities&version={version}'.replace('{service}', service).replace('{version}', version);
                this.$http.get(url).then(successCallback,erroCallback);
            }

        },
        _parseXml:function(xml, service, baseUrl){
            var data = null;
            switch (service) {
                case 'wmts':
                    data = this._parseWMTS(xml, baseUrl);
                    break;
                case 'wms':
                    data = this._parseWMS(xml, baseUrl);
                    break;
                case 'wcs':
                    data = this._parseWCS(xml, baseUrl);
                    break;
                case 'wfs':
                    data = this._parseWFS(xml, baseUrl);
                    break;
                default:
                    this.$Message.error({
                        content:"不支持的服务类型 " + service,
                        duration: 3
                    });
                    break;
            }
            return data;
        },
        _parseWMTS:function(xml, baseUrl) {
            // console.log(xml)
            //将xml解析成joson文件
            const that = this;
            var capa = this._parseXmlToJSON(xml);
            console.log(capa);
            var layers = this._confirmArray(capa.Contents.Layer).map(function(layer) {
                var tmslink = that._confirmArray(layer.TileMatrixSetLink);
                return {
                    label: layer.Identifier.toString(),
                    folder: true,
                    hideCheckbox: true,
                    children: tmslink.map(function(tms, index) {
                        var tilematrixset = tms.TileMatrixSet;
                        var t = that._getObj(capa.Contents.TileMatrixSet, 'Identifier', tilematrixset);
                        var b = layer.WGS84BoundingBox;
                        var bbox = (b.LowerCorner.toString() + " " + b.UpperCorner.toString()).split(" ");
                        return {
                            label: tms.TileMatrixSet,
                            //生成一个唯一的id
                            id: +new Date() + "" + Math.random() * 1000,
                            TileMatrixSet: tms.TileMatrixSet,
                            Layer: layer.Identifier.toString(),
                            srs: t.SupportedCRS.toString(),
                            bbox: bbox,
                            minZoom: parseInt(t.TileMatrix[0].Identifier.toString()),
                            maxZoom: parseInt(t.TileMatrix[t.TileMatrix.length - 1].Identifier.toString()),
                            format: layer.Format,
                            url: baseUrl,
                            //标识是否可以右击弹出菜单
                            menu: true,
                            type: 'TileMatrixSet'
                        }
                    }),
                    type: 'Layer'
                };
            });

            return layers; //[{},{}]
        },
        _parseWMS:function(xml, baseUrl) {
            var capa = this._parseXmlToJSON(xml);
            var layers = this._confirmArray(capa.Capability.Layer.Layer).map(function(layer) {
                var tmp = layer.LatLonBoundingBox;
                var bbox = [tmp._minx, tmp._miny, tmp._maxx, tmp._maxy];
                return {
                    label: layer.Title,
                    id: +new Date() + "" + Math.random() * 1000,
                    name: layer.Name,
                    bbox: bbox, //layer.LatLonBoundingBox[0].extent, //这里还不确定，要根据具体的wms文件来进一步确定
                    url: baseUrl,
                    menu: true,
                    type: 'WMSLayer'
                        //wms的投影可以由用户指定，所以也指定成4326
                }
            });
            return layers;
        },
        _parseWFS: function(xml, baseUrl) {
            var capa = this._parseXmlToJSON(xml);
            // $rootScope.wfsCapa = capa; //设置属性过滤器时需要
            var featureTypeList = this._confirmArray(capa.FeatureTypeList.FeatureType).map(function(featureType) {
                // var b = featureType.WGS84BoundingBox;
                // var bbox = (b.LowerCorner.toString() + " " + b.UpperCorner.toString()).split(" ");

                // var tmp = featureType.LatLonBoundingBox;
                var tmp = featureType.LatLongBoundingBox;
                var bbox = [tmp._minx, tmp._miny, tmp._maxx, tmp._maxy];
                return {
                    label: featureType.Title,
                    name: featureType.Name,
                    id: +new Date() + "" + Math.random() * 1000,
                    // SRS: featureType.SRS, //'EPSG:3857'
                    srs: featureType.SRS, //'EPSG:3857'
                    bbox: bbox,
                    url: baseUrl,
                    menu: true,
                    type: 'WFSFeatureType'
                }
            });
            return featureTypeList;
        },
        _parseWCS(xml, baseUrl) {
            var capa = this._parseXmlToJSON(xml);
            var wcsNameList = this._confirmArray(capa.ContentMetadata.CoverageOfferingBrief).map(function(item) {
                var bbox = (item.lonLatEnvelope.pos[0].toString() + " " + item.lonLatEnvelope.pos[1].toString()).split(" ");
                return {
                    label: item.name.toString(),
                    name: item.name.toString(),
                    id: +new Date() + "" + Math.random() * 1000,
                    // wcs 只有4326这一种投影
                    SRS: 'EPSG:4326',
                    bbox: bbox,
                    url: baseUrl,
                    menu: true,
                    format: item.label.toString(),
                    type: 'WCS'
                }
            });
            return wcsNameList;
        },
        _parseXmlToJSON:function(xml) {
            var xml_json;
            xml_json = this.$x2js.xml2js(xml);
           
            //去除最外层的标签包裹
            for (var i in xml_json) {
                xml_json = xml_json[i];
            }
            return xml_json;
        },
        _confirmArray: function(obj){
            return Array.isArray(obj) ? obj : [obj]
        },
        _getObj: function(array, key, val) {
            var re = this._confirmArray(array).filter(function(item) {
                return item[key] == val;
            })
            return re[0]
        },
        menuOptions:function(event,data,node,component){
            var e = event.currentTarget;
            console.log("i am here ")
            if(data.menu){
                if (data.type === "WMSLayer") {
                    this.$refs.contextmenu2.handleReferenceContextmenu(event); 
                } else if (data.type === "WFSFeatureType") {
                    this.$refs.contextmenu3.handleReferenceContextmenu(event); 
                }
                else{//wmts和wcs点击右键显示contextmenu1菜单
                    this.$refs.contextmenu1.handleReferenceContextmenu(event); 
                }
                this.data1 = data;
                
            }
        },
        loadLayer1: function(data){
            // document.body.removeEventListener('click',this.handelClick);
            this.loadLayer(data);
            //  data.loaded = true;
        },
        unloadLayer1: function(data){
            this.unloadLayer(data);
        },
        upLayer1: function(data){
            this.upLayerTop(data);
        },
        locate1:function(data){
            this.viewRectangle(data);
        },
        toggleRange1:function(data){
            this.toggleRange(data);
        },
        getMenuMeta:function(data){
            if(data['url'].indexOf('wmts') !== -1){
                this.modal1 = true;
                this.tabledata = [
                    {
                        title:'元数据图层',
                        value:data.Layer
                    },
                    {
                        title:'元数据ID',
                        value:data.id
                    },
                    {
                        title:'请求范围',
                        value:data.bbox
                    },
                    {
                        title:'请求格式',
                        value:data.format
                    },
                    {
                        title:'请求url',
                        value:data.url
                    },
                    {
                        title:'请求类型',
                        value:data.type
                    },
                    {
                        title:'投影类型',
                        value:data.srs
                    },
                    {
                        title:'zoom范围',
                        value:[data.minZoom,data.maxZoom]
                    }
                ]
            }
            else if(data['url'].indexOf('wfs') !== -1){
                console.log(data['url'])
            }
            else if(data['url'].indexOf('wcs') !== -1){
                console.log(data['url'])
            }
            else{
                console.log(data['url'])
            }
        }
    }
    
}
</script>

<style >
.collapsed-none{
    display: none;
}
.ivu-tree-title{
    color:white !important ;
    font-size: 15px ;
    /* width:100%; */
    height:30px;
    vertical-align:middle;
    padding-top:5px;
    /* overflow:scroll; */
}

.ivu-tree li{
    overflow-x:auto;
}
.el-tree-node__label {
    font-size: 15px;
    overflow-x:auto;
}
.el-tree-node__content{
    height:30px !important;
}
</style>
