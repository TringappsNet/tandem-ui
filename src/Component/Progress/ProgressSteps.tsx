import React from 'react';
import styles from './ProgressSteps.module.css';

interface ProgressStepsProps {
  steps: number;
  activeStep: number;
}

const ProgressSteps: React.FC<ProgressStepsProps> = ({ steps, activeStep }) => {
  const circles = [];
  for (let i = 1; i <= steps; i++) {
    circles.push(
      <div
        key={i}
        className={`${styles.progressCircle} ${i <= activeStep ? styles.active : ''}`}
      />
    );
  }

  return <div className={styles.progressContainer}>{circles}</div>;
};

export default ProgressSteps;
