import { Link } from 'react-router-dom';

export function BrandMark() {
  return (
    <Link className="brand" to="/" aria-label="木辛-零基础学AI 首页">
      <span className="brand__mark" aria-hidden="true">
        <span />
        <span />
      </span>
      <span className="brand__name">木辛-零基础学AI</span>
    </Link>
  );
}
