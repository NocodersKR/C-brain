const metrics = [
  { label: "진행 프로젝트", value: "12" },
  { label: "검토 대기", value: "4" },
  { label: "이번 달 문의", value: "28" },
];

export function App() {
  return (
    <main className="admin-shell">
      <aside className="sidebar" aria-label="관리자 메뉴">
        <strong>C-Brain</strong>
        <nav>
          <a href="/">대시보드</a>
          <a href="/">프로젝트</a>
          <a href="/">문의</a>
        </nav>
      </aside>

      <section className="workspace" aria-labelledby="page-title">
        <header className="page-header">
          <div>
            <p>Admin</p>
            <h1 id="page-title">운영 현황</h1>
          </div>
          <button type="button">새 프로젝트</button>
        </header>

        <div className="metrics" aria-label="주요 지표">
          {metrics.map((metric) => (
            <article className="metric" key={metric.label}>
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
