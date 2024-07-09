import { render, fireEvent, screen } from '@testing-library/react';
import Navbar from './Navbar';
import { Provider } from 'react-redux';
import store from '../Redux/store';
import { BrowserRouter as Router } from 'react-router-dom';

describe('Navbar', () => {
    const links = [
        { disabled: false, name: 'DEALS', href: '/cards' },
        { disabled: false, name: 'SITE', href: '/site' },
        { disabled: false, name: 'LANDLORD', href: '/landlord' },
      ];

  test('renders navbar with logo and title', () => {
    render(<Provider store={store}><Router><Navbar links={links} /></Router></Provider>);
    expect(screen.getByAltText('Tandem Logo')).toBeInTheDocument();
    expect(screen.getByText('TANDEM INFRASTRUCTURE')).toBeInTheDocument();
  });

  test('opens and closes dropdown menu', () => {
    render(<Provider store={store}><Router><Navbar links={links} /></Router></Provider>);
    const dropdownButton = screen.getByText('Guest');
    fireEvent.click(dropdownButton);
    expect(screen.getByText('Profile')).toBeInTheDocument();
    fireEvent.click(dropdownButton);
    expect(screen.queryByText('Profile')).not.toBeInTheDocument();
  });

  test('navigates to cards page on "DEALS" click', () => {
    const { getByText } =  render(<Provider store={store}><Router><Navbar links={links} /></Router></Provider>);
    fireEvent.click(getByText('DEALS'));
    expect(window.location.pathname).toBe('/cards');
  });

  test('calls createDealForm function on "CREATE" click', () => {
    const { getByText } = render(<Provider store={store}><Router><Navbar links={links} /></Router></Provider>);
    const createButton = getByText('CREATE');
    fireEvent.click(createButton);
    expect(screen.getByText('Deal Form')).toBeInTheDocument();
  });
  test('renders each link with correct text and style', () => {
    render(<Provider store={store}><Router><Navbar links={links} /></Router></Provider>);
    
    links.forEach((link) => {
      const linkElement = screen.getByText(link.name);
      expect(linkElement).toBeInTheDocument();
    });
  });
});
