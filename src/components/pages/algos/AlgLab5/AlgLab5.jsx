import React, { useState, useCallback } from 'react';
import styles from './AlgLab5.module.css';
import { ControlPanel } from './ControlPanel';
import { PageBase } from '../../../../react-envelope/components/pages/base/PageBase/PageBase';
import { Close, Configure } from '../../../../react-envelope/components/dummies/Icons';

export const AlgLab5 = () => {
  const [controls, setControls] = useState({
    seed: 1,
    minTaskTime: 10,
    maxTaskTime: 20,
    processorsCount: 3,
    tasksCount: 5,
    populationSize: 3,
    generationsWithoutImprovement: 3,
    crossoverProbability: 1,
    mutationProbability: 1,
  });
  const [cpv, setCPV] = useState(true);

  const handleSolve = useCallback((params) => {
    setControls(params);

    // Запуск алгоритма
  }, []);

  const handleClear = useCallback(() => {
    // Очищаем решение задачи
  }, []);

  return (
    <PageBase>
      <div className={styles.container}>
        <ControlPanel 
          initialValues={controls}
          onSolve={handleSolve}
          onClear={handleClear}
          className={cpv && styles.active}
        />
        {cpv ? <Close className={`icon-m pointer ${styles.cpvbtn} fixed`} onClick={() => setCPV(false)}/> : 
          <Configure className={`icon-m pointer ${styles.cpvbtn} fixed`} onClick={() => setCPV(true)}/>}
      </div>
    </PageBase>
  );
};
