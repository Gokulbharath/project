import { describe, it, expect } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { Arrivals } from '@/pages/staff/Arrivals';

describe('Route /staff/arrivals', () => {
  it('renders Arrivals page and not Table Map', () => {
    render(
      <MemoryRouter initialEntries={['/staff/arrivals']}>
        <Routes>
          <Route path="/staff/arrivals" element={<Arrivals />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/Arrivals/i)).toBeInTheDocument();
    expect(screen.queryByText(/Table Map/i)).not.toBeInTheDocument();
  });
});

