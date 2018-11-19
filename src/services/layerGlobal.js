import Vue from 'vue';
import global_ from './global';
import Cesium from 'cesium/Cesium'
import 'cesium/Widgets/widgets.css'
// import 'ol/ol.css'
// import iView from 'iview'
// import 'iview/dist/styles/iview.css'

var map3d = null;
var wmtsURLTemplate = "{baseurl}?layer={layer}&style=default&tilematrixset={tilematrixset}&service=wmts&request=gettile&version=1.0.0&format={format}&tileMatrix={z}&tilerow={y}&tilecol={x}";
var loaded3dLayers = {};
var isShown = false;
export default {
    install(Vue, options) {
        Vue.prototype.viewRectangle = function(params) {
            if (Vue.prototype.GLOBAL.olcs == '2d') {

            } else if (Vue.prototype.GLOBAL.olcs == '3d') {
                var requestBbox = params.bbox;
                if (!map3d) {
                    map3d = Vue.prototype.GLOBAL.map3d;
                }
                var viewer = map3d;
                var west = requestBbox[0];
                var south = requestBbox[1];
                var east = requestBbox[2];
                var north = requestBbox[3];
                var rectangle = Cesium.Rectangle.fromDegrees(west, south, east, north);
                viewer.camera.flyTo({
                    destination: rectangle
                });

                // Show the rectangle.  Not required; just for show.
                // viewer.entities.add({
                //     rectangle: {
                //         coordinates: rectangle,
                //         fill: false,
                //         outline: true,
                //         outlineColor: Cesium.Color.WHITE
                //     }
                // });
            }
        }
        Vue.prototype.toggleRange = function(params) {
            if (Vue.prototype.GLOBAL.olcs == '2d') {

            } else if (Vue.prototype.GLOBAL.olcs == '3d') {
                var requestBbox = params.bbox;
                if (!map3d) {
                    map3d = Vue.prototype.GLOBAL.map3d;
                }
                var viewer = map3d;
                var west = requestBbox[0];
                var south = requestBbox[1];
                var east = requestBbox[2];
                var north = requestBbox[3];
                if (west == -180 && south == -90 && east == 180 && north == 90) {
                    this.$Message.warning({
                        content: '该范围为全球范围，不在地球上显示',
                        duration: 3
                    });
                    return;
                }
                var rectangle = Cesium.Rectangle.fromDegrees(west, south, east, north);
                // Show the rectangle.  Not required; just for show.
                if (!isShown) {
                    viewer.entities.add({
                        id: params.id,
                        rectangle: {
                            coordinates: rectangle,
                            fill: false,
                            outline: true,
                            outlineColor: Cesium.Color.WHITE
                        }
                    });
                    isShown = true;
                } else {
                    viewer.entities.removeById(params.id);
                    isShown = false;
                }

            }
        }
        Vue.prototype.upLayerTop = function(params) {
            console.log("i am in upLayer")
            if (Vue.prototype.GLOBAL.olcs == '2d') {

            } else if (Vue.prototype.GLOBAL.olcs == '3d') {
                var layer = loaded3dLayers[params.id];
                if (!layer) {
                    this.$Message.error({
                        content: '需要先加载该图层',
                        duration: 3
                    });
                    return;
                }
                var layers = map3d.imageryLayers;
                console.log(layer);
                layers.raiseToTop(layer)
            }
        }
        Vue.prototype.unloadLayer = function(params) {
            if (Vue.prototype.GLOBAL.olcs == '2d') {

            } else if (Vue.prototype.GLOBAL.olcs == '3d') {
                var layer = loaded3dLayers[params.id];
                if (!layer) {
                    this.$Message.error({
                        content: '需要先加载该图层',
                        duration: 3
                    });
                    return;
                }
                var layers = map3d.imageryLayers;
                layers.remove(layer, false);
                delete loaded3dLayers[params.id];
            }
        }
        Vue.prototype.loadLayer = function(params) {
            switch (params.type.toLowerCase()) {
                //wmts为了与原来的版本一致
                // 'TileMatrixSet'
                case 'tilematrixset':
                    _loadWMTS(params);
                    break;
                    // 'WMSLayer'
                case 'wmslayer':
                    _loadWMS(params);
                    break;
                    // 'WFSFeatureType'
                case 'wfsfeaturetype':
                    _loadWFS(params);
                    break;
                    // 'WCS'
                case 'wcs':
                    _loadWCS(params);
                    break;
                    // gridDem
                case 'griddem': //用于重力值变成wcs的DEM格式加载
                    loadGridDemForGravity(params);
                    break;
                default:
                    this.$Message.error({
                        content: '不支持的类型' + params.type,
                        duration: 3
                    });
            }
        }

        function _loadWMTS(params) {
            var url = wmtsURLTemplate
                .replace('{baseurl}', params.url)
                .replace('{layer}', params.Layer)
                .replace('{tilematrixset}', params.TileMatrixSet)
                .replace('{format}', params.format);
            var requestBbox = params.bbox;
            if (Vue.prototype.GLOBAL.olcs == '2d') {
                alert("2d!");
            } else if (Vue.prototype.GLOBAL.olcs == '3d') {
                map3d = null;
                if (!map3d) {
                    map3d = Vue.prototype.GLOBAL.map3d;
                }
                if (loaded3dLayers[params.id]) {
                    Vue.prototype.unloadLayer(params);
                }
                var layers = map3d.imageryLayers;
                var tilingScheme = null;
                if (params.srs == "EPSG:4326") {
                    tilingScheme = new Cesium.GeographicTilingScheme();
                } else {
                    tilingScheme = new Cesium.WebMercatorTilingScheme();
                }
                var wmtsLayer = new Cesium.ImageryLayer(new Cesium.UrlTemplateImageryProvider({
                    url: url,
                    tileWidth: 256,
                    tileHeight: 256,
                    tilingScheme: tilingScheme,
                    minimumLevel: params.minZoom,
                    maximumLevel: params.maxZoom,
                    rectangle: Cesium.Rectangle.fromDegrees(requestBbox[0], requestBbox[1], requestBbox[2], requestBbox[3])
                }));
                layers.add(wmtsLayer);
                loaded3dLayers[params.id] = wmtsLayer;
            }
        }

        function _loadWFS(params) {

        }
    }
}