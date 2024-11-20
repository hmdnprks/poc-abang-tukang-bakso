import { render, screen } from '@testing-library/react';
import DirectionBox from './DirectionBox';

jest.mock('@heroicons/react/24/outline', () => ({
  ArrowLeftIcon: () => <svg data-testid="arrow-left" />,
  ArrowRightIcon: () => <svg data-testid="arrow-right" />,
  ArrowUpIcon: () => <svg data-testid="arrow-up" />,
}));

describe('DirectionBox', () => {
  const steps = [
    { direction: 'right', description: 'Turn right at the traffic light' },
    { direction: 'left', description: 'Turn left at the next intersection' },
    { direction: 'straight', description: 'Go straight for 2 miles' },
  ];

  test('renders the component with directions', () => {
    render(<DirectionBox steps={steps} />);
    expect(screen.getByText('Directions')).toBeInTheDocument();
    steps.forEach((step) => {
      expect(screen.getByText(step.description)).toBeInTheDocument();
    });
  });

  test('renders correct icons based on direction', () => {
    render(<DirectionBox steps={steps} />);

    expect(screen.getByTestId('arrow-right')).toBeInTheDocument();
    expect(screen.getByTestId('arrow-left')).toBeInTheDocument();
    expect(screen.getByTestId('arrow-up')).toBeInTheDocument();
  });

  test('handles an empty steps array gracefully', () => {
    render(<DirectionBox steps={[]} />);
    expect(screen.getByText('Directions')).toBeInTheDocument();
    expect(screen.queryByTestId('arrow-right')).not.toBeInTheDocument();
    expect(screen.queryByTestId('arrow-left')).not.toBeInTheDocument();
    expect(screen.queryByTestId('arrow-up')).not.toBeInTheDocument();
  });
});
