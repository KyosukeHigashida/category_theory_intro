import 'vue'

// Slidev が Vue template に注入する値。使用する公開コンテキストのみ型を宣言する。
// https://sli.dev/guide/global-context
// ランタイムの実装は Slidev に任せ、アプリ側のコードには複製しない。
declare module 'vue' {
  interface ComponentCustomProperties {
    $page: number
    $clicks: number
  }
}
