import { defineComponent, createVNode } from 'file:///Users/jesse/Doc/Projects/WritePro/app/node_modules/vue/index.mjs';
import { c as createError } from '../server.mjs';
import 'file:///Users/jesse/Doc/Projects/WritePro/app/node_modules/ofetch/dist/node.mjs';
import 'file:///Users/jesse/Doc/Projects/WritePro/app/node_modules/hookable/dist/index.mjs';
import 'file:///Users/jesse/Doc/Projects/WritePro/app/node_modules/unctx/dist/index.mjs';
import 'file:///Users/jesse/Doc/Projects/WritePro/app/node_modules/@unhead/ssr/dist/index.mjs';
import 'file:///Users/jesse/Doc/Projects/WritePro/app/node_modules/unhead/dist/index.mjs';
import 'file:///Users/jesse/Doc/Projects/WritePro/app/node_modules/@unhead/shared/dist/index.mjs';
import 'file:///Users/jesse/Doc/Projects/WritePro/app/node_modules/ufo/dist/index.mjs';
import 'file:///Users/jesse/Doc/Projects/WritePro/app/node_modules/h3/dist/index.mjs';
import 'file:///Users/jesse/Doc/Projects/WritePro/app/node_modules/vue/server-renderer/index.mjs';
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

const components_islands = {};
const islandComponents = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  default: components_islands
});
const islandRenderer = /* @__PURE__ */ defineComponent({
  props: {
    context: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const component = islandComponents[props.context.name];
    if (!component) {
      throw createError({
        statusCode: 404,
        statusMessage: `Island component not found: ${JSON.stringify(component)}`
      });
    }
    return () => createVNode(component || "span", props.context.props);
  }
});

export { islandRenderer as default };
//# sourceMappingURL=island-renderer-c8eaf7c1.mjs.map
