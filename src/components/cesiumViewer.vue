<template>
    <div id="cesiumContainer"></div>
</template>

<script>
import Cesium from 'cesium/Cesium'
import 'cesium/Widgets/widgets.css'

export default {

  name: 'cesiumContainer',
  data () {
    return {
      'viewer' : {}
    }
  },
  mounted() {
        //设置静态资源目录
        // buildModuleUrl.setBaseUrl('../static/Cesium/')
        //创建viewer实例
    this.initMap();
        
  },
  methods:{
        initMap:function(){
            this.GLOBAL.map3d = this.viewer = new Cesium.Viewer('cesiumContainer',{
                animation: false, //是否显示动画控件
                shouldAnimate : true,
                homeButton: false, //是否显示Home按钮
                fullscreenButton: false, //是否显示全屏按钮
                baseLayerPicker: false, //是否显示图层选择控件
                geocoder: false, //是否显示地名查找控件
                timeline: false, //是否显示时间线控件
                sceneModePicker: true, //是否显示投影方式控件
                navigationHelpButton: false, //是否显示帮助信息控件
                infoBox: false, //是否显示点击要素之后显示的信息
                requestRenderMode: true, //启用请求渲染模式
                scene3DOnly: false, //每个几何实例将只能以3D渲染以节省GPU内存
                sceneMode: 3, //初始场景模式 1 2D模式 2 2D循环模式 3 3D模式  Cesium.SceneMode
                fullscreenElement: document.body, //全屏时渲染的HTML元素 暂时没发现用处
            });
            this.viewer._cesiumWidget._creditContainer.style.display="none";  
            // var layers = this.viewer.imageryLayers;
            // layers.addImageryProvider(new Cesium.UrlTemplateImageryProvider({
            //     url : 'http://192.168.0.51:8083/services/ServiceSpace1/wmts/testOGCService1?layer=Geoglobal0803_cloud&style=default&tilematrixset=Geoglobal0803_cloud&service=wmts&request=gettile&version=1.0.0&format=&tileMatrix={z}&tilerow={y}&tilecol={x}',
            //     tileWidth: 256,
            //     tileHeight: 256,
            //     tilingScheme : new Cesium.GeographicTilingScheme(),
            // }));
        }
  }
}
</script>


<style scoped>

</style>