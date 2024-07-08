import { render,screen } from '@testing-library/react';
import Profile from './profile';

const profileData = [
    { label: "Id", value: "ID01" },
    { label: "Name", value: "Admin User" },
    { label: "Email", value: "tandeminfrastructure@gmail.com" },
    { label: "Mobile", value: "789456123" },
    { label: "Address", value: "2nd road" },
    { label: "Country", value: "United States" },
    { label: "State", value: "California" },
    { label: "Zipcode", value: "12345" },
];

describe('Profile', () => {
    test('renders profile component ', () => {
        render(<Profile />);
    });

    test('displays profile data correctly', () => {
        render(
            <Profile/>
        );
        expect(screen.getByText('tandeminfrastructure@gmail.com')).toBeInTheDocument();
        expect(screen.getByText('United States')).toBeInTheDocument();
    });

    test('applies correct CSS classes', () => {
        const { container } = render(<Profile />);
        expect(container.firstChild).toHaveClass('container');
    });

    test('checks all profile data items', () => {
        const { getByText } = render(<Profile />);
        profileData.forEach(({ label}) => {
            expect(getByText(`${label}:`)).toBeInTheDocument();
        });
    });
});
