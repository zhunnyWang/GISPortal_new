<script>
const baseUrl = "http://192.168.0.51:8083";
let map = null;
let defaultProj = null;
let user = {
        username: "lx",
        password: "11",
        auth: ["数据浏览", "元数据管理", "切片工具", "集群管理", "金字塔回收站", "用户管理", '导入导出', "入库工具"],
        rolelevel: 0
    };
let nowrole = null;
let overflowY = null;
let olcs = '3d';
let map3d = null;
// let visible = null;
export default {
    baseUrl,
    map,
    defaultProj,
    user,
    nowrole,
    overflowY,
    olcs,
    map3d
    // visible
}
</script>