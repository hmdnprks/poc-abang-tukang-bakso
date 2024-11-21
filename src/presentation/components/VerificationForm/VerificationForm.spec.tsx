import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import VerificationForm from './VerificationForm';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { getDatabase, set } from 'firebase/database';

jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(() => ({})),
  getApps: jest.fn(() => []),
  getApp: jest.fn(() => ({})),
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(() => ({})),
}));

jest.mock('firebase/database', () => ({
  getDatabase: jest.fn(() => ({})),
  ref: jest.fn(),
  push: jest.fn(() => ({ key: 'mockDocId' })),
  set: jest.fn(),
}));

jest.mock('firebase/analytics', () => ({
  getAnalytics: jest.fn(() => null),
}));


jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('../../hooks/useLocalStorage', () =>
  jest.fn(() => [null, jest.fn()])
);

describe('VerificationForm', () => {
  const mockPush = jest.fn();


  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (getDatabase as jest.Mock).mockReturnValue({});
  });

  test('renders form elements correctly', () => {
    render(<VerificationForm />);

    expect(screen.getByLabelText('Nama')).toBeInTheDocument();
    expect(screen.getByLabelText('Role')).toBeInTheDocument();
    expect(screen.getByText('Join')).toBeDisabled();
  });

  test('shows validation errors when form fields are invalid', async () => {
    render(<VerificationForm />);

    const nameInput = screen.getByLabelText('Nama');
    fireEvent.change(nameInput, { target: { value: 'ABC' } });
    fireEvent.change(nameInput, { target: { value: '' } });

    const roleSelect = screen.getByLabelText('Role');
    fireEvent.change(roleSelect, { target: { value: 'customer' } });
    fireEvent.change(roleSelect, { target: { value: '' } });

    const termsCheckbox = screen.getByTestId('tnc');
    fireEvent.click(termsCheckbox);
    fireEvent.click(termsCheckbox);


    expect(await screen.findByText('Nama harus diisi')).toBeInTheDocument();
    expect(await screen.findByText('Role harus diisi')).toBeInTheDocument();
    expect(
      await screen.findByText('Kamu harus menyetujui syarat dan ketentuan')
    ).toBeInTheDocument();

    expect(screen.getByText('Join')).toBeDisabled();
  });


  test('enables submit button when form is valid', async () => {
    render(<VerificationForm />);

    fireEvent.change(screen.getByLabelText('Nama'), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByLabelText('Role'), {
      target: { value: 'customer' },
    });
    fireEvent.click(screen.getByTestId('tnc'));

    await waitFor(() => {
      expect(screen.getByText('Join')).not.toBeDisabled();
    });
  });

  test('submits the form successfully and redirects', async () => {
    (set as jest.Mock).mockResolvedValueOnce(undefined);

    render(<VerificationForm />);

    fireEvent.change(screen.getByPlaceholderText('Masukkan nama'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText('Role'), { target: { value: 'vendor' } });
    fireEvent.click(screen.getByTestId('tnc'));

    const submitButton = screen.getByTestId('submit');
    await waitFor(() => expect(submitButton).not.toBeDisabled());

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(set).toHaveBeenCalledWith(expect.anything(), {
        name: 'John Doe',
        role: 'vendor',
        status: 'active',
        createdAt: expect.any(String),
      });
      expect(toast.success).toHaveBeenCalledWith('Selamat datang, John Doe!');
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  test('handles form submission failure gracefully', async () => {
    (set as jest.Mock).mockRejectedValueOnce(new Error('Network Error'));

    render(<VerificationForm />);

    fireEvent.change(screen.getByLabelText('Nama'), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByLabelText('Role'), {
      target: { value: 'customer' },
    });
    fireEvent.click(screen.getByTestId('tnc'));

    const submitButton = screen.getByTestId('submit');
    await waitFor(() => expect(submitButton).not.toBeDisabled());

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Failed to submit. Please try again.'
      );
      expect(mockPush).not.toHaveBeenCalled();
    });
  });
});
