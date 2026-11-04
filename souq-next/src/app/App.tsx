const categories = [
  ['🚗', 'سيارات'], ['🏠', 'عقارات'], ['📱', 'موبايلات'],
  ['💻', 'إلكترونيات'], ['🛋️', 'أثاث'], ['💼', 'وظائف'],
  ['🧰', 'خدمات'], ['✨', 'متنوعات']
];

export default function App() {
  return (
    <main className="shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="سوق - الرئيسية"><span className="brand-mark">س</span><span>سوق</span></a>
        <nav aria-label="القائمة الرئيسية"><a href="#categories">الأقسام</a><a href="#how">كيف يعمل؟</a></nav>
        <button className="login" type="button" disabled>حسابي قريباً</button>
      </header>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow"><i /> المنصة المصرية للبيع والشراء</span>
          <h1>كل حاجة ليها <em>سوق.</em></h1>
          <p>بيع، اشتري، واكتشف فرص جديدة من حولك — بتجربة أبسط وأسرع.</p>
          <div className="search" role="search"><span>⌕</span><input aria-label="ابحث عن منتج أو خدمة" placeholder="بتدور على إيه النهارده؟" /><button type="button" disabled>ابحث</button></div>
          <small className="hero-hint">منصة واحدة تجمع احتياجاتك في مكان واحد.</small>
        </div>
        <div className="hero-art" aria-hidden="true"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="float-card card-a">🏡 <span>بيتك الجديد</span></div><div className="float-card card-b">📱 <span>اختيارات ذكية</span></div><div className="market-symbol">س</div><div className="float-card card-c">🚘 <span>فرص تستاهل</span></div></div>
      </section>
      <section className="categories-section" id="categories">
        <div className="section-title"><div><span className="kicker">اكتشف بسهولة</span><h2>تسوق حسب القسم</h2></div><span className="section-note">كل اللي تحتاجه.. أقرب مما تتخيل</span></div>
        <div className="category-grid">{categories.map(([icon, name]) => <button className="category" key={name} type="button" disabled><span>{icon}</span><b>{name}</b><small>قريباً</small></button>)}</div>
      </section>
      <section className="how" id="how"><div><span className="kicker">تجربة مختلفة</span><h2>سوق معمول علشان يسهّلها.</h2></div><p>نبني تجربة موثوقة تحترم بياناتك وتخلي البيع والشراء أوضح — خطوة بخطوة.</p></section>
      <footer><b>سوق</b><span>© {new Date().getFullYear()} سوق — تجربة جديدة قيد التطوير.</span></footer>
    </main>
  );
}