<template>
  <el-card style="height: 400px;">
    <quill-editor v-model="content" :options="editorOption" style="height: 300px;">
      <!-- 自定义toolar -->
      <div id="toolbar" slot="toolbar">
        <!-- Add a bold button -->
        <button class="ql-bold" title="加粗">Bold</button>
        <button class="ql-italic" title="斜体">Italic</button>
        <button class="ql-underline" title="下划线">underline</button>
        <button class="ql-strike" title="删除线">strike</button>
        <button class="ql-blockquote" title="引用"></button>
        <button class="ql-code-block" title="代码"></button>
        <button class="ql-header" value="1" title="标题1"></button>
        <button class="ql-header" value="2" title="标题2"></button>
        <!--Add list -->
        <button class="ql-list" value="ordered" title="有序列表"></button>
        <button class="ql-list" value="bullet" title="无序列表"></button>
        <!-- Add font size dropdown -->
        <select class="ql-header" title="段落格式">
          <option selected>段落</option>
          <option value="1">标题1</option>
          <option value="2">标题2</option>
          <option value="3">标题3</option>
          <option value="4">标题4</option>
          <option value="5">标题5</option>
          <option value="6">标题6</option>
        </select>
        <select class="ql-size" title="字体大小">
          <option value="10px">10px</option>
          <option value="12px">12px</option>
          <option value="14px">14px</option>
          <option value="16px" selected>16px</option>
          <option value="18px">18px</option>
          <option value="20px">20px</option>
        </select>
        <select class="ql-font" title="字体">
          <option value="SimSun">宋体</option>
          <option value="SimHei">黑体</option>
          <option value="Microsoft-YaHei">微软雅黑</option>
          <option value="KaiTi">楷体</option>
          <option value="FangSong">仿宋</option>
          <option value="Arial">Arial</option>
        </select>
        <!-- Add subscript and superscript buttons -->
        <select class="ql-color" value="color" title="字体颜色"></select>
        <select class="ql-background" value="background" title="背景颜色"></select>
        <select class="ql-align" value="align" title="对齐"></select>
        <button class="ql-clean" title="还原"></button>
        <!-- You can also add your own -->
      </div>
    </quill-editor>
  </el-card>
</template>

<script>
// 导入富文本编辑框
import { Quill, quillEditor } from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

// 引入font.css
import '@/assets/css/font.css'

// 自定义字体大小
const Size = Quill.import('attributors/style/size')
Size.whitelist = ['10px', '12px', '14px', '16px', '18px', '20px']
Quill.register(Size, true)

// 自定义字体类型
const fonts = ['SimSun', 'SimHei', 'Microsoft-YaHei', 'KaiTi', 'FangSong', 'Arial', 'Times-New-Roman', 'sans-serif', '宋体', '黑体']
const Font = Quill.import('formats/font')
Font.whitelist = fonts
Quill.register(Font, true)

export default {
  name: 'MyRichtext',
  components: {
    quillEditor
  },
  data() {
    return {
      // 文本内容
      content: '',
      editorOption: {
        placeholder: '请输入正文',
        theme: 'snow', // or 'bubble'
        modules: {
          toolbar: {
            container: '#toolbar'
          }
        }
      }
    }
  },
  watch: {
    content(newval, oldval) {
      this.$emit('shareVal', newval)
    }
  }
}
</script>

<style lang="less" scoped>
:deep(.ql-snow .ql-picker) {
  margin-right: 0;
  line-height: 24px;
}
</style>
