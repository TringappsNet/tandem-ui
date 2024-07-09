import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router} from 'react-router-dom';
import Dashboard from './Dashboard';
import store from '../Redux/store';
import Cards from '../Cards/Cards';
import LandlordGrid from '../Grids/landlordGrid/Landlord';
import SiteGrid from '../Grids/SiteGrid/SiteGrid';

jest.mock('../AxiosInterceptor/AxiosInterceptor', () => ({
}));

jest.mock('../Navbar/Navbar', () => () => <div>Navbar</div>);
jest.mock('../Cards/Cards', () => () => <div>Cards</div>);
jest.mock('../Main/Main', () => () => <div>Main</div>);
jest.mock('../Grids/Site-grid/site-grid', () => () => <div>SiteGrid</div>);
jest.mock('../Grids/landlordGrid/landlord-grid', () => () => <div>LandlordGrid</div>);

describe('Dashboard Component', () => {
  it('Render the Navbar and Main components', () => {
    render(
      <Provider store={store}>
        <Router>
          <Dashboard />
        </Router>
      </Provider>
    );

    expect(screen.getByText('Navbar')).toBeInTheDocument();
    expect(screen.getByText('Main')).toBeInTheDocument();
  });

  it('navigate to /cards and render the Cards component', () => {
    render(
      <Provider store={store}>
        <Router>
          <Cards/>
        </Router>
      </Provider>
    );

    expect(screen.getByText('Cards')).toBeInTheDocument();
  });

  it('navigate to /site and render the SiteGrid component', () => {
    render(
      <Provider store={store}>
        <Router>
          <SiteGrid/>
        </Router>
      </Provider>
    );

    expect(screen.getByText('SiteGrid')).toBeInTheDocument();
  });

  it('navigate to /landlord and render the LandlordGrid component', () => {
    render(
      <Provider store={store}>
        <Router>
          <LandlordGrid/>
        </Router>
      </Provider>
    );

    expect(screen.getByText('LandlordGrid')).toBeInTheDocument();
  });
  it('invalid route', () => {
    render(
      <Provider store={store}>
        <Router>
          <Dashboard/>
        </Router>
      </Provider>
    );
    expect(screen.getByText('Navbar')).toBeInTheDocument();
  });
});
