// src/shared/components/layouts/Sidebar.tsx
import React, { FC } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, TrendingUp, Wallet, Settings, Menu } from 'lucide-react'; // Ajuste os ícones conforme sua necessidade[ 1 (https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQE16PhqSJI5dDSjq-bgalulz13QZtyAuy9-hDhXiPQPtOMa-HnMqyZeNnpIHV7wGicmf2w9trpgZrgh1KoKd-xqWzt3t4DWObpbDN_wAGs=)][ 4 (https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQEggT8uqBiAiCUdR0X2SKSkW_1G3yUwpZJ29ZjySYUyCB2dHjKkVnTKYhjUhJPT1XPs5gN58R5ezufFEfC-0tNYAUEbe8punc57BkrnnW-arOhwXX1jEWe6ZHjcBy7H_qTi3BIImw==)][ 5 (https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQF58210QNraFfO-j3FiiVuS5m2uJAmXNRG-XBGaJFEV3WsNZryme3VVFb-0a0yUKWECOH2_yo4pbaeehWfP753OhlkWvSF9AUOgep4BZfRVVnKJMBDhZDQGnUXRwsSAdFnu7EBqIoh3nMw=)][ 7 (https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQFF-INEPVCMBDWB4Q7MKrQRtWx5OT6l46mNEzDOGLa1tOYBoqYu-f0gFjSjntMXtTpwevgJ1oQWGoOyBNCVZ87bGmFHHZrxfvH7qGumpKPUREJY6hfTss9meax9Ex--_h1Y1h49Efw=)]

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Performance', icon: TrendingUp, path: '/performance' },
    { name: 'Financeiro', icon: Wallet, path: '/financial' },
    { name: 'Configurações', icon: Settings, path: '/settings' },
  ];

  return (
    <>
      {/* Overlay para mobile quando o sidebar está aberto */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={onClose}
        ></div>
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-white shadow-lg z-40 transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:h-auto lg:w-64`} /* Ajuste para desktop */ /*[ 2 (https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQECdduxB7YktV1eInX6LJJ5J2PDmjdTe9YhG78ceVpZu13yd7CRtDLRIhlX4F8jMCmNeWBnseXOE7_DBcHoLB7EgWlKBdksk7UvozLUXeVMXin-WL7Wd5r-ytaXnIVe3OnK18cOo8gqF9dNpHGqti92nyAi7y5lQp-5p6rNsSQVAIuD5UWZrbIiFOiy)][ 6 (https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQF6heVnNAGnnhQOeTt2lfjTtn9wFeMldZ409glIExQC68XnbsimOFERurnT8z3wa1A8Iv9ZBiULP9-t0_aDDcIyPWBFrowvJVwYJARIwsCOFwVt6PKMfJU5B-c68tSgVOkWdlJ_g268dQ==)][ 8 (https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQFF544e1nNPI2NVx3KsRDysZO0agc6XwY9DiCWR1Yux7Hy47oqtNZLNUhpMb5RUGq0qzSiHWwBioCBA4c0813EO4daAIEucqaQneSiTY28_FCeqRzv90lDbR9fwHFr4nsfKH5s96lpOpHNNF0u6l9H-mlpkzJTf9Kb7VVcmtJazK0XL_X__qVM_cuUD3S4v3r98yQ_PWuU=)][ 9 (https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQG57Wxh4A6Dp1DAGL4cfM4HOZ3GOMgpclBGz1rWKmvsljdtYAcxfyWk82PrBsve6SZuGK7N1WC-LSI4OQ_You-q6vuDT816RGcPqKGRPvs9N9pwMPjulfxvZaIXxzDNaiVbL5I2beGg4walQsAj3em0fXvOCjDnmB1jvx-GluinwigNEAgfCPA8qNMP3Gfr)][ 11 (https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQGvR9fEHJiyJTU3R-Ia3e3jWLrs2lZ0mD3n_Ww7YZHykmXkfF8NBt_X_BCP6ERh9czKRoN5TrAmPVi9r6dgT74uMwD60ZJH8kI9Cw-sduZdX08s6Q7Y_1dLdQkifHC2AodeajhQM_jlyw==)][ 13 (https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQHGhAsUBquR8VTiuCNuRVJsRPwhfUye7BUC7vZliajc-Up0aZ4OB0AkJa4G-Fbx2J9qJIPsLL6eoiKjRuxJkfRubJVJAqLPWn84aLoO7J8qbexmtOL9G-VyhkVZWifqKmz2QEGq644F4DRGY-xe4w==)][ 14 (https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQHPyrFIFXW0lCTfqS1QfYE4Kfdjl7KXIFtEH4h0h0clcIzyfhccjHPnB1hhomgeFCyeLQsA2UWyMEhMR5h-VCWbYa1DDCc_5kRJxiurKyC12IpnIvHvlUiJXY7nVs5bQBmwutn5cdo=)] */
      >
        <div className="p-4 flex items-center justify-between border-b border-gray-700">
          <h1 className="text-2xl font-bold">FAHUB Manager</h1>
          <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-white">
            <Menu size={24} />
          </button>
        </div>
        <nav className="mt-5">
          <ul>
            {navItems.map((item) => (
              <li key={item.name} className="mb-2">
                <NavLink
                  to={item.path}
                  end={item.path === '/'} // Garante que apenas o Dashboard seja ativo na rota raiz[ 10 (https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQGTyZTkhHIOEIlFgkOWr9yPLM1ocJ1M2bQP2UQn1jbaYEPCgl90oCyncoG7SzSXXJSzj3xw7ZNjkjHE0oXWN7LsFYtKwjlXfaaumienuCYM9xw8w9ky_l9QaxONKhOhxJ82Zbyaq_6yTC65XXRarl0k)][ 15 (https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQHiDSRL1ez9yxn9RpiGyA1gbpIjVpywlnFSWmzsKcVSILfwyr16z6pZt6kJQFGGZxZWbAP54Bh6fxdCYzzLNkvXnaXKAKGWTZZJYPB57vRrS74j8rFJ3BL1rueyJjzYC25O_lQPXHNUmFU=)]
                  className={({ isActive }) =>
                    `flex items-center p-4 rounded-lg mx-3 transition-colors duration-200
                    ${isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`
                  }
                  onClick={onClose} // Fechar sidebar em mobile ao clicar no link
                >
                  <item.icon size={20} className="mr-3" />
                  <span className="text-lg">{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;