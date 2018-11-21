<template>
    <div>
      <div id="cesiumContainer"></div>
      <div class="latlng_show">  
        <div class="longitude_show" ref="longitude_show">  
            <font size="3" color="white">经度：{{longitudeShow}}</font>  
        </div>  
        <div class="latitude_show" ref="latitude_show">  
            <font size="3" color="white">纬度：{{latitudeShow}}</font>  
        </div>  
      </div>
    </div>
</template>

<script>
import Cesium from 'cesium/Cesium'
import 'cesium/Widgets/widgets.css'

export default {

  name: 'cesiumContainer',
  data () {
    return {
      'viewer' : {},
      longitudeShow:'暂无坐标',
      latitudeShow:'暂无坐标'
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

            //经纬度
            var canvas = this.viewer.scene.canvas;
            var ellipsoid = this.viewer.scene.globe.ellipsoid;  
            var handler = new Cesium.ScreenSpaceEventHandler(canvas);  
            var that = this;
            handler.setInputAction(function(movement){  
            //捕获椭球体，将笛卡尔二维平面坐标转为椭球体的笛卡尔三维坐标，返回球体表面的点  
             var cartesian = that.viewer.camera.pickEllipsoid(movement.endPosition, ellipsoid);  
              if(cartesian){  
                   //将笛卡尔三维坐标转为地图坐标（弧度）  
                   var cartographic = that.viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian);  
                   //将地图坐标（弧度）转为十进制的度数  
                    var lat_String=Cesium.Math.toDegrees(cartographic.latitude).toFixed(4);  
                    var log_String=Cesium.Math.toDegrees(cartographic.longitude).toFixed(4);  
                    that.longitudeShow=log_String;  
                    that.latitudeShow=lat_String;  
               }  
            },Cesium.ScreenSpaceEventType.MOUSE_MOVE); 

            // this.viewer.scene.screenSpaceCameraController.minimumZoomDistance = 250000;//相机的高度的最小值
            this.viewer.scene.screenSpaceCameraController.maximumZoomDistance = 22000000;  //相机高度的最大值
            this.viewer.scene.screenSpaceCameraController._minimumZoomRate = 30000; // 设置相机缩小时的速率
            this.viewer.scene.screenSpaceCameraController._maximumZoomRate = 5906376272000    //设置相机放大时

            //用primitive怎么画只有轮廓的长方形？
            // var scene = this.viewer.scene;
            // var instances = [];
            // for(var lon = -180.0; lon < 180.0; lon += 6){
            //   for(var lat = -88.0; lat < 88.0; lat += 4){
            //     instances.push(new Cesium.GeometryInstance({
            //       geometry: new Cesium.RectangleOutlineGeometry({
            //         rectangle: Cesium.Rectangle.fromDegrees(lon, lat, lon + 6.0, lat + 4.0),
            //         // vertexFormat:Cesium.PerInstanceColorAppearance.VERTEXT_FORMAT
            //       }),
            //       attributes:{
            //         // color:new Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.fromRandom({alpha:0.5}))
            //         color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.WHITE)
            //       }
            //     }))
            //   }
            // }
            // scene.primitives.add(new Cesium.Primitive({
            //   geometryInstances : instances,
            //   appearance : new Cesium.PerInstanceColorAppearance({
            //       flat: true,
            //       translucent: false,
            //       renderState: {
            //           lineWidth: Math.min(4.0, scene.maximumAliasedLineWidth)
            //       }
            //   })
            // }))

            //相机高度变化事件
            // this.viewer.camera.changed.addEventListener(function(){
            //         var scene = that.viewer.scene;
            //         var ellipsoid = scene.globe.ellipsoid;//var ellipsoid=viewer.camera.ellipsoid;
            //         //获得当前高度
            //         var height = ellipsoid.cartesianToCartographic(that.viewer.camera.position).height;  
            //         console.log(height)
            // })
            
        },
        getHeight(viewer){
          if (viewer) {
              var scene = viewer.scene;
              var ellipsoid = scene.globe.ellipsoid;
              var height = ellipsoid.cartesianToCartographic(viewer.camera.position).height;
              return height;
          }
        }
  }
}
</script>


<style scoped>
.latlng_show{
  width:340px;
  height:30px;
  position:absolute;
  top:10px;
  left:20px;
  z-index:1;
  font-size:15px;
}
.longitude_show{
  width:150px;
  height:30px;
  float:left
}
.latitude_show{
  width:150px;
  height:30px;
  float:left;
}
</style>