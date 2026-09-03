import { Search } from 'lucide-react';
import { type FormEvent, useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { BrandMark } from './BrandMark';

export function AppShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (location.pathname !== '/learn') return;
    setQuery(new URLSearchParams(location.search).get('q') ?? '');
  }, [location.pathname, location.search]);

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const keyword = query.trim();
    navigate(keyword ? `/learn?q=${encodeURIComponent(keyword)}` : '/learn');
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="site-header__inner">
          <BrandMark />
          <form className="header-search" role="search" onSubmit={submitSearch}>
            <Search size={18} aria-hidden="true" />
            <input
              aria-label="全站搜索"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="搜索 RAG、评测、面试…"
            />
            <button type="submit" aria-label="搜索">搜索</button>
          </form>
        </div>
      </header>
      <Outlet />
      <footer className="site-footer">
        <div className="site-footer__inner">
          <BrandMark />
          <p>从真实任务开始，少一点术语，多一个能用的结果。</p>
          <div className="footer-links">
            <NavLink to="/learn">学习目录</NavLink>
            <NavLink to="/projects">项目实战</NavLink>
          </div>
        </div>
      </footer>
    </div>
  );
}
