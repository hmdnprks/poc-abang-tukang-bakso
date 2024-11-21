import React from 'react';
import { Step } from '@core/entities/Step';
import { ArrowLeftIcon, ArrowRightIcon, ArrowUpIcon } from '@heroicons/react/24/outline';
import styles from './style.module.scss';

interface DirectionsProps {
  steps: Step[];
}

const DirectionBox: React.FC<DirectionsProps> = ({ steps }) => {
  const getIcon = (direction: Step['direction']) => {
    switch (direction) {
      case 'right':
        return <ArrowRightIcon className={styles['icon']} />;
      case 'left':
        return <ArrowLeftIcon className={styles['icon']} />;
      case 'straight':
        return <ArrowUpIcon className={styles['icon']} />;
      default:
        return null;
    }
  };

  return (
    <div className={styles['direction-box']}>
      <h3 className={styles['header']}>Directions</h3>
      {steps.map((step) => (
        <div className={styles['direction-step']} key={step.description}>
          {getIcon(step.direction)}
          <span className={styles['description']}>{step.description}</span>
        </div>
      ))}
    </div>
  );
};

export default DirectionBox;
