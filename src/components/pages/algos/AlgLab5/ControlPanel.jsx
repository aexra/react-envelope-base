import React, { useState } from 'react';
import styles from './AlgLab5.module.css';
import { TextBox } from '../../../../react-envelope/components/ui/input/text/TextBox/TextBox';

export const ControlPanel = ({ initialValues, onSolve, onClear, isRunning, className }) => {
  const [formValues, setFormValues] = useState(initialValues);

  const handleChange = (name, value) => {
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formValues);
    onSolve(formValues);
  };

  return (
    <div className={`${styles.controlPanel} ${className}`}>
      <span className='bold' style={{fontSize: 'var(--h2-font-size)'}}>Параметры алгоритма</span>
      <form onSubmit={handleSubmit} className='flex col g10'>
        <TextBox 
          placeholder="Введите сид рандома"
          borderType="fullr"
          label="Seed"
          regex={/^[0-9]+$/}
          value={formValues.seed}
          onChange={(e) => handleChange('seed', e)}
        />
        
        <TextBox 
          placeholder="Введите количество задач"
          borderType="fullr"
          label="Количество задач"
          regex={/^[0-9]+$/}
          value={formValues.tasksCount}
          onChange={(e) => handleChange('tasksCount', e)}
        />

        <TextBox 
          placeholder="Введите количество процессоров"
          borderType="fullr"
          label="Количество процессоров"
          regex={/^[0-9]+$/}
          value={formValues.processorsCount}
          onChange={(e) => handleChange('processorsCount', e)}
        />

        <TextBox 
          placeholder="Введите минимальное время задачи"
          borderType="fullr"
          label="Минимальное время задачи (t1)"
          regex={/^[0-9]+$/}
          value={formValues.minTaskTime}
          onChange={(e) => handleChange('minTaskTime', e)}
        />
        
        <TextBox 
          placeholder="Введите максимальное время задачи"
          borderType="fullr"
          label="Максимальное время задачи (t2)"
          regex={/^[0-9]+$/}
          value={formValues.maxTaskTime}
          onChange={(e) => handleChange('maxTaskTime', e)}
        />
        
        <TextBox 
          placeholder="Введите количество особей"
          borderType="fullr"
          label="Особей в поколении"
          regex={/^[0-9]+$/}
          value={formValues.populationSize}
          onChange={(e) => handleChange('populationSize', e)}
        />
        
        <TextBox 
          placeholder="Введите количество поколений"
          borderType="fullr"
          label="Поколений без улучшений"
          regex={/^[0-9]+$/}
          value={formValues.generationsWithoutImprovement}
          onChange={(e) => handleChange('generationsWithoutImprovement', e)}
        />
        
        <TextBox 
          placeholder="Введите вероятность (0-1)"
          borderType="fullr"
          label="Вероятность кроссовера"
          regex={/^0\.[0-9]{1,2}$|^1$/}
          value={formValues.crossoverProbability}
          onChange={(e) => handleChange('crossoverProbability', e)}
        />
        
        <TextBox 
          placeholder="Введите вероятность (0-1)"
          borderType="fullr"
          label="Вероятность мутации"
          regex={/^0\.[0-9]{1,2}$|^1$/}
          value={formValues.mutationProbability}
          onChange={(e) => handleChange('mutationProbability', e)}
        />
        
        <div className={styles.buttonGroup}>
          <button type="submit" disabled={isRunning}>
            Решить
          </button>
          <button type="button" onClick={onClear} disabled={isRunning}>
            Очистить
          </button>
        </div>
      </form>
    </div>
  );
};