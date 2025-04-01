import React from 'react';
import styles from './AlgLab5.module.css';

export const AlgorithmVisualization = ({ state, controls }) => {
  if (!state) {
    return (
      <div className={styles.visualization}>
        <p>Введите параметры и нажмите "Решить" для запуска алгоритма</p>
      </div>
    );
  }

  return (
    <div className={styles.visualization}>
      <h2>Результаты работы алгоритма</h2>
      
      <div className={styles.summary}>
        <h3>Лучшее решение</h3>
        <p>Максимальная загрузка: {state.bestFitness}</p>
        <p>Поколение: {state.bestGeneration}</p>
        
        <h4>Распределение задач:</h4>
        <ul>
          {state.bestIndividual.processors.map((tasks, idx) => (
            <li key={idx}>
              Процессор {idx + 1}: {tasks.join(', ')} (Сумма: {tasks.reduce((a, b) => a + b, 0)})
            </li>
          ))}
        </ul>
      </div>
      
      <div className={styles.generations}>
        <h3>Ход выполнения</h3>
        {state.generations.map((gen, idx) => (
          <Generation key={idx} generation={gen} index={idx} />
        ))}
      </div>
    </div>
  );
};

const Generation = ({ generation, index }) => {
  return (
    <div className={styles.generation}>
      <h4>Поколение {index + 1}</h4>
      
      <div className={styles.individuals}>
        {generation.individuals.map((ind, idx) => (
          <Individual key={idx} individual={ind} />
        ))}
      </div>
      
      {generation.crossoverEvents && (
        <div className={styles.crossoverEvents}>
          <h5>Кроссоверы:</h5>
          {generation.crossoverEvents.map((event, idx) => (
            <CrossoverEvent key={idx} event={event} />
          ))}
        </div>
      )}
      
      {generation.mutationEvents && (
        <div className={styles.mutationEvents}>
          <h5>Мутации:</h5>
          {generation.mutationEvents.map((event, idx) => (
            <MutationEvent key={idx} event={event} />
          ))}
        </div>
      )}
    </div>
  );
};

const Individual = ({ individual }) => {
  return (
    <div className={styles.individual}>
      <p>Фитнес: {individual.fitness}</p>
      <p>Генотип: {individual.genotype.join(', ')}</p>
      <div className={styles.processors}>
        {individual.processors.map((tasks, idx) => (
          <div key={idx} className={styles.processor}>
            Процессор {idx + 1}: {tasks.join(', ')} (Сумма: {tasks.reduce((a, b) => a + b, 0)})
          </div>
        ))}
      </div>
    </div>
  );
};

const CrossoverEvent = ({ event }) => {
  return (
    <div className={styles.crossoverEvent}>
      <p>Родители: {event.parents.join(' и ')}</p>
      <p>Потомки: {event.children.join(' и ')}</p>
      <p>Точка кроссовера: {event.crossoverPoint}</p>
    </div>
  );
};

const MutationEvent = ({ event }) => {
  return (
    <div className={styles.mutationEvent}>
      <p>Особь: {event.individualIndex}</p>
      <p>Ген: {event.geneIndex} (было: {event.oldValue}, стало: {event.newValue})</p>
      <p>Бинарное представление: {event.oldBinary} → {event.newBinary}</p>
      <p>Изменён бит: {event.changedBit}</p>
    </div>
  );
};