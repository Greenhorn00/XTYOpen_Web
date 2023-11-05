//引入代码美化插件
import Prism from "prismjs";
let Highlight = {};
// 自定义插件
Highlight.install = function(Vue) {
    // 自定义指令 v-highlight
    Vue.directive("highlight", {
        // 指令所在组件的 VNode 及其子 VNode 全部更新后调用
        componentUpdated: function() {
            //代码美化
            Prism.highlightAll();
        },
    });
};
export default Highlight;
