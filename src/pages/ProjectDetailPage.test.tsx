import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import { ProjectDetailPage } from './ProjectDetailPage';

function renderProject() {
  return render(
    <MemoryRouter initialEntries={['/projects/interview-assistant']}>
      <Routes>
        <Route path="/projects/:id" element={<ProjectDetailPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('项目实战详情', () => {
  beforeEach(() => localStorage.clear());

  it('展示项目产出和七个可完成步骤', () => {
    renderProject();

    expect(screen.getByRole('heading', { name: 'AIPM面试资料智能助手' })).toBeInTheDocument();
    expect(screen.getAllByRole('checkbox')).toHaveLength(7);
    expect(screen.getByText('一份产品方案')).toBeInTheDocument();
  });

  it('记住完成状态并允许重置', () => {
    const firstRender = renderProject();
    const firstStep = screen.getByRole('checkbox', { name: /定义用户和问题/ });
    fireEvent.click(firstStep);
    expect(firstStep).toBeChecked();

    firstRender.unmount();
    renderProject();
    expect(screen.getByRole('checkbox', { name: /定义用户和问题/ })).toBeChecked();

    fireEvent.click(screen.getByRole('button', { name: '重置项目进度' }));
    expect(screen.getByRole('checkbox', { name: /定义用户和问题/ })).not.toBeChecked();
  });
});
