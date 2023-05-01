import { useSSRContext, defineComponent, computed, unref, mergeProps } from 'file:///Users/jesse/Doc/Projects/WritePro/app/node_modules/vue/index.mjs';
import { _ as _export_sfc, u as useAppConfig } from '../server.mjs';
import { ssrRenderAttrs } from 'file:///Users/jesse/Doc/Projects/WritePro/app/node_modules/vue/server-renderer/index.mjs';
import 'file:///Users/jesse/Doc/Projects/WritePro/app/node_modules/ofetch/dist/node.mjs';
import 'file:///Users/jesse/Doc/Projects/WritePro/app/node_modules/hookable/dist/index.mjs';
import 'file:///Users/jesse/Doc/Projects/WritePro/app/node_modules/unctx/dist/index.mjs';
import 'file:///Users/jesse/Doc/Projects/WritePro/app/node_modules/@unhead/ssr/dist/index.mjs';
import 'file:///Users/jesse/Doc/Projects/WritePro/app/node_modules/unhead/dist/index.mjs';
import 'file:///Users/jesse/Doc/Projects/WritePro/app/node_modules/@unhead/shared/dist/index.mjs';
import 'file:///Users/jesse/Doc/Projects/WritePro/app/node_modules/ufo/dist/index.mjs';
import 'file:///Users/jesse/Doc/Projects/WritePro/app/node_modules/h3/dist/index.mjs';
import 'file:///Users/jesse/Doc/Projects/WritePro/app/node_modules/klona/dist/index.mjs';
import 'file:///Users/jesse/Doc/Projects/WritePro/app/node_modules/@iconify/vue/dist/offline.mjs';
import 'file:///Users/jesse/Doc/Projects/WritePro/app/node_modules/@iconify/vue/dist/iconify.mjs';
import '../../nitro/nitro-prerenderer.mjs';
import 'file:///Users/jesse/Doc/Projects/WritePro/app/node_modules/node-fetch-native/dist/polyfill.mjs';
import 'file:///Users/jesse/Doc/Projects/WritePro/app/node_modules/destr/dist/index.mjs';
import 'file:///Users/jesse/Doc/Projects/WritePro/app/node_modules/unenv/runtime/fetch/index.mjs';
import 'file:///Users/jesse/Doc/Projects/WritePro/app/node_modules/scule/dist/index.mjs';
import 'file:///Users/jesse/Doc/Projects/WritePro/app/node_modules/defu/dist/defu.mjs';
import 'file:///Users/jesse/Doc/Projects/WritePro/app/node_modules/ohash/dist/index.mjs';
import 'file:///Users/jesse/Doc/Projects/WritePro/app/node_modules/unstorage/dist/index.mjs';
import 'file:///Users/jesse/Doc/Projects/WritePro/app/node_modules/unstorage/drivers/fs.mjs';
import 'file:///Users/jesse/Doc/Projects/WritePro/app/node_modules/radix3/dist/index.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "IconCSS",
  __ssrInlineRender: true,
  props: {
    name: {
      type: String,
      required: true
    },
    size: {
      type: String,
      default: ""
    }
  },
  setup(__props) {
    var _a;
    const props = __props;
    const appConfig = useAppConfig();
    ((_a = appConfig == null ? void 0 : appConfig.nuxtIcon) == null ? void 0 : _a.aliases) || {};
    const iconName = computed(() => {
      var _a2;
      return (((_a2 = appConfig == null ? void 0 : appConfig.nuxtIcon) == null ? void 0 : _a2.aliases) || {})[props.name] || props.name;
    });
    const iconUrl = computed(() => `url('https://api.iconify.design/${iconName.value.replace(":", "/")}.svg')`);
    const sSize = computed(() => {
      var _a2, _b, _c;
      if (!props.size && typeof ((_a2 = appConfig.nuxtIcon) == null ? void 0 : _a2.size) === "boolean" && !((_b = appConfig.nuxtIcon) == null ? void 0 : _b.size)) {
        return void 0;
      }
      const size = props.size || ((_c = appConfig.nuxtIcon) == null ? void 0 : _c.size) || "1em";
      if (String(Number(size)) === size) {
        return `${size}px`;
      }
      return size;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _cssVars = { style: {
        "--71ded496": unref(iconUrl)
      } };
      _push(`<span${ssrRenderAttrs(mergeProps({
        style: { width: unref(sSize), height: unref(sSize) }
      }, _attrs, _cssVars))} data-v-11604bcf></span>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/nuxt-icon/dist/runtime/IconCSS.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const IconCSS = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-11604bcf"]]);

export { IconCSS as default };
//# sourceMappingURL=IconCSS-9662d08d.mjs.map
