import { render, screen } from '@testing-library/react';
import Verification from './page';

jest.mock('next/head', () => {
  return {
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  };
});

jest.mock('@components/VerificationForm/VerificationForm', () => {
  const MockVerificationForm = () => (
    <div data-testid="verification-form">Verification Form</div>
  );
  MockVerificationForm.displayName = 'MockVerificationForm';
  return MockVerificationForm;
});

describe('Verification Page', () => {
  test('renders the page with correct title and form', () => {
    render(<Verification />);

    expect(screen.getByText('Verification')).toBeInTheDocument();
    expect(screen.getByTestId('verification-form')).toHaveTextContent('Verification Form');
  });
});
