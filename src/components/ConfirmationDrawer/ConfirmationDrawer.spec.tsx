import { render, screen, fireEvent } from '@testing-library/react';
import ConfirmationDrawer from './ConfirmationDrawer';

describe('ConfirmationDrawer', () => {
  const mockOnClose = jest.fn();
  const mockOnConfirm = jest.fn();
  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    onConfirm: mockOnConfirm,
    children: 'Are you sure?',
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders the drawer when isOpen is true', () => {
    render(<ConfirmationDrawer {...defaultProps} />);
    expect(screen.getByText('Are you sure?')).toBeInTheDocument();
    expect(screen.getByAltText('Warning')).toBeInTheDocument();
  });

  test('does not render the drawer when isOpen is false', () => {
    render(<ConfirmationDrawer {...defaultProps} isOpen={false} />);
    expect(screen.queryByText('Are you sure?')).not.toBeInTheDocument();
  });

  test('calls onClose when the overlay is clicked', () => {
    render(<ConfirmationDrawer {...defaultProps} />);
    const overlay = screen.getByLabelText('Overlay');
    fireEvent.click(overlay);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('calls onConfirm when the "OK" button is clicked', () => {
    render(<ConfirmationDrawer {...defaultProps} />);
    const confirmButton = screen.getByText('OK');
    fireEvent.click(confirmButton);
    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });

  test('calls onClose when the "Batal" button is clicked', () => {
    render(<ConfirmationDrawer {...defaultProps} />);
    const cancelButton = screen.getByText('Batal');
    fireEvent.click(cancelButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('displays children content correctly', () => {
    render(<ConfirmationDrawer {...defaultProps} />);
    expect(screen.getByText('Are you sure?')).toBeInTheDocument();
  });
});
