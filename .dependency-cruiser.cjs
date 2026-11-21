// 依存のルール（docs/architecture.md 4章、5.1）を機械でチェックする。
/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: "domain-imports-nothing",
      comment: "domain は、どのパッケージも外部ライブラリも import しない（architecture 4章）。",
      severity: "error",
      from: { path: "^packages/domain/" },
      to: { pathNot: "^packages/domain/" },
    },
    {
      name: "domain-features-isolated",
      comment:
        "domain の機能フォルダどうしは import しない。共有してよいのは contracts/ と shared/ だけ（architecture 5.1）。",
      severity: "error",
      from: { path: "^packages/domain/([^/]+)/" },
      to: {
        path: "^packages/domain/",
        pathNot: ["^packages/domain/$1/", "^packages/domain/(contracts|shared)/"],
      },
    },
    {
      name: "application-only-domain",
      comment: "application が import してよいのは domain だけ（architecture 4章）。",
      severity: "error",
      from: { path: "^packages/application/" },
      to: { path: "^packages/(adapters|app|content)/" },
    },
    {
      name: "adapters-not-app",
      comment: "adapters は app を import しない（architecture 4章）。",
      severity: "error",
      from: { path: "^packages/adapters/" },
      to: { path: "^packages/app/" },
    },
    {
      name: "app-not-domain",
      comment:
        "app は domain を直接 import しない。ViewModel と Command だけを使う（architecture 4章）。",
      severity: "error",
      from: { path: "^packages/app/" },
      to: { path: "^packages/domain/" },
    },
    {
      name: "content-has-no-code",
      comment: "content はデータだけを持ち、コードを持たない（architecture 3章）。",
      severity: "error",
      from: { path: "^packages/content/" },
      to: {},
    },
    {
      name: "no-circular",
      severity: "error",
      from: {},
      to: { circular: true },
    },
    {
      name: "not-to-unresolvable",
      severity: "error",
      from: {},
      to: { couldNotResolve: true },
    },
  ],
  options: {
    doNotFollow: { path: "node_modules" },
    exclude: { path: "(^|/)node_modules/" },
    tsPreCompilationDeps: true,
    tsConfig: { fileName: "tsconfig.base.json" },
    enhancedResolveOptions: {
      exportsFields: ["exports"],
      conditionNames: ["import", "types", "default"],
      extensions: [".ts", ".tsx", ".js", ".json"],
    },
  },
};
