import Vue from 'vue';
import global_ from './global';
import Cesium from 'cesium/Cesium'
import 'cesium/Widgets/widgets.css'

var map3d = null;
var flag = 0;
var params = 0;
export default {
    install(Vue, options) {
        Vue.prototype.openPrimitive = function() {
            if (!map3d) {
                map3d = Vue.prototype.GLOBAL.map3d;
            }
            var viewer = map3d;
            var scene = viewer.scene;
            if (!flag) {
                var instances = [];
                for (var lon = -180.0; lon < 180.0; lon += 6) {
                    for (var lat = -60.0; lat < 60.0; lat += 4) {
                        instances.push(new Cesium.GeometryInstance({
                            geometry: new Cesium.RectangleOutlineGeometry({
                                rectangle: Cesium.Rectangle.fromDegrees(lon, lat, lon + 6.0, lat + 4.0),
                            }),
                            attributes: {
                                color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.WHITE)
                            }
                        }))
                    }
                }
                for (var lon = -180.0; lon < 180.0; lon += 12) {
                    for (var lat = 60.0; lat < 88.0; lat += 4) {
                        instances.push(new Cesium.GeometryInstance({
                            geometry: new Cesium.RectangleOutlineGeometry({
                                rectangle: Cesium.Rectangle.fromDegrees(lon, lat, lon + 12.0, lat + 4.0),
                            }),
                            attributes: {
                                color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.WHITE)
                            }
                        }))
                    }
                }
                for (var lon = -180.0; lon < 180.0; lon += 12) {
                    for (var lat = -88.0; lat < -60.0; lat += 4) {
                        instances.push(new Cesium.GeometryInstance({
                            geometry: new Cesium.RectangleOutlineGeometry({
                                rectangle: Cesium.Rectangle.fromDegrees(lon, lat, lon + 12.0, lat + 4.0),
                            }),
                            attributes: {
                                color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.WHITE)
                            }
                        }))
                    }
                }
                scene.primitives.add(new Cesium.Primitive({
                    geometryInstances: instances,
                    appearance: new Cesium.PerInstanceColorAppearance({
                        flat: true, //不考虑光照
                        translucent: false, //不透明
                        renderState: {
                            lineWidth: Math.min(4.0, scene.maximumAliasedLineWidth)
                        }
                    })
                }))
                flag = 1;
            } else {
                scene.primitives.removeAll();
                flag = 0;
            }
        }

        Vue.prototype.openSheet = function() {
            if (!map3d) {
                map3d = Vue.prototype.GLOBAL.map3d;
            }
            var viewer = map3d;
            var entities = viewer.entities;
            if (!flag) {
                params = 0;
                for (var lon = -180.0; lon < 180.0; lon += 6) {
                    for (var lat = -60.0; lat < 60.0; lat += 4) {
                        params = params + 1;
                        entities.add({
                            id: params.toString(),
                            rectangle: {
                                coordinates: Cesium.Rectangle.fromDegrees(lon, lat, lon + 6.0, lat + 4.0),
                                outline: true,
                                outlineColor: Cesium.Color.WHITE,
                                outlineWidth: 2,
                                // stRotation : Cesium.Math.toRadians(45),
                                fill: false,

                            }
                        })
                    }
                }
                for (var lon = -180.0; lon < 180.0; lon += 12) {
                    for (var lat = 60.0; lat < 88.0; lat += 4) {
                        params = params + 1;
                        entities.add({
                            id: params.toString(),
                            rectangle: {
                                coordinates: Cesium.Rectangle.fromDegrees(lon, lat, lon + 12.0, lat + 4.0),
                                outline: true,
                                outlineColor: Cesium.Color.WHITE,
                                outlineWidth: 2,
                                // stRotation : Cesium.Math.toRadians(45),
                                fill: false,
                                // id: '' + lon + lat
                            }
                        })
                    }
                }
                for (var lon = -180.0; lon < 180.0; lon += 12) {
                    for (var lat = -88.0; lat < -60.0; lat += 4) {
                        params = params + 1;
                        entities.add({
                            id: params.toString(),
                            rectangle: {
                                coordinates: Cesium.Rectangle.fromDegrees(lon, lat, lon + 12.0, lat + 4.0),
                                outline: true,
                                outlineColor: Cesium.Color.WHITE,
                                outlineWidth: 2,
                                // stRotation : Cesium.Math.toRadians(45),
                                fill: false,
                                // id: '' + lon + lat
                            }
                        })
                    }
                }
                flag = 1;
            } else {
                for (var i = 1; i <= params; i++) {
                    var index = i.toString();
                    entities.removeById(index);
                }
                flag = 0;

            }


        }
    }
}