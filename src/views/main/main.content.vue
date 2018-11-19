<template>
<div>
    
   <div id="map2d" class="fullWindow" v-show="convert2D">
       
   </div>
   <div id="map3d" class="fullWindow" v-show="convert3D">
       <cesium-viewer></cesium-viewer>
    </div> 
    <div class="row" v-show="convert2D">
        <ul class="d2-draw-helper">
            <li ref="rotatetarget" class="rotatetarget"></li>
            <li ref="MousePosition" class="MousePosition"></li>
        </ul>
    </div>
</div>  
</template>
<script>
// import OLCesium from 'olcs/OLCesium.js';
//引入ol
import 'ol/ol.css'
import olView from 'ol/View.js';
import olMap from 'ol/Map.js';
import {transform} from 'ol/proj.js';
import olLayerTile from 'ol/layer/Tile.js';
import olSourceOSM from 'ol/source/OSM.js';
import {defaults as olControlDefaults} from 'ol/control.js';
import {defaults as interactionDefaults} from 'ol/interaction.js';
import olInteractionDragPan from 'ol/interaction/DragPan';
import olInteractionDragRotateAndZoom from 'ol/interaction/DragRotateAndZoom';
import olControlScaleLine from 'ol/control/ScaleLine';
import olControlMousePosition from 'ol/control/MousePosition';
import {createStringXY} from 'ol/coordinate';
//引入cesium界面
import cesiumViewer from '../../components/cesiumViewer'
export default {
    props: ['childMsg'],
    components : {
        'cesiumViewer' : cesiumViewer
    },
    data(){
        return{
            convert3D: true,
            convert2D: false,
            // 'viewer' : {}
        }
    },
    mounted(){
        // this.viewer = new Cesium.Viewer('map3d');
        this.initMap();
    },
    watch:{
        childMsg(val){
            if(val == 1){
                this.convert2D = true;
                // this.initMap();
                this.convert3D =false;
                this.GLOBAL.olcs = '2d';
            }
            else{
                this.convert2D = false;
                this.convert3D = true;
                this.GLOBAL.olcs = '3d';
            }
        }
    },
    methods:{
        initMap:function(){
            var defaultProj;
            this.GLOBAL.defaultProj = defaultProj = "EPSG:4326";
            var center = [],
            zoom;
            center.push(parseFloat(114));
            center.push(parseFloat(30));
            zoom = parseInt(4);
            const view = new olView({
                projection: defaultProj, //投影
                extent: [-180, -90, 180, 90], //控制中心点的范围，center不能超过这个范围
                center: transform(center, 'EPSG:4326', defaultProj), //转换源投影到目标投影的坐标。 这将返回一个新的坐标
                zoom: zoom, //初始缩放级别
                maxZoom: 17,
                minZoom: 3
            });
            const map = this.GLOBAL.map = new olMap({
            target: 'map2d',
            //用户控制地图的工具
            controls: olControlDefaults({ //地图中的一组默认控件，false不显示该默认控件
                attribution: false,
                zoom: false,
                rotateOptions: {//将旋转重置为0的工具
                    className: "custom-ol-rotate",
                    target: this.$refs.rotatetarget
                }
            }).extend([ //添加其他控件
                new olControlScaleLine({ //比例尺控件
                    className: 'custom-ol-scaleline' //比例尺的样式
                }),
                new olControlMousePosition({ //鼠标位置控件，显示鼠标指针2D坐标
                    projection: 'EPSG:4326',
                    coordinateFormat: createStringXY(4), //坐标显示的格式
                    className: ' text-danger', //坐标值的样式
                    target: this.$refs.MousePosition, //将坐标显示在地图某个地方
                    undefinedHTML: "鼠标经纬度"
                })
            ]),
            //地图交互功能
            interactions: interactionDefaults({
                dragPan: false
            }).extend([
                new olInteractionDragRotateAndZoom(), //拖拽方式进行缩放和旋转地图
                new olInteractionDragPan({ //拖拽平移地图
                    kinetic: null
                })
            ]),
            layers: [
                new olLayerTile({
                source: new olSourceOSM()})
            ], //底图开关控制$rootScope.baseLayer
            view: view
            });
            // Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0MzAyNzUyYi0zY2QxLTQxZDItODRkOS1hNTA3MDU3ZTBiMDUiLCJpZCI6MjU0MSwiaWF0IjoxNTMzNjI1MTYwfQ.oHn1SUWJa12esu7XUUtEoc1BbEbuZpRocLetw6M6_AA';
            // const ol3d = new OLCesium({ map, target: 'map3d' });
            // const scene = ol3d.getCesiumScene();
            // scene.terrainProvider = Cesium.createWorldTerrain();
            // ol3d.setEnabled(true);
        }

    }
}
</script>

<style scoped>
.fullWindow {
  position: fixed;
  height: 100%;
  width: 100%;
  overflow: hidden;
  padding: 0;
  font-family: sans-serif;
  background-color: #F0F2F3;
}
#cesiumContainer {
 width: 100%; 
 height: 94%; 
 margin: 0; 
 padding: 0; 
 overflow: hidden;
}

</style>