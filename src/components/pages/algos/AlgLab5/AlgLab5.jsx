import React, { useState, useCallback } from 'react';
import styles from './AlgLab5.module.css';
import { ControlPanel } from './ControlPanel';
import { AlgorithmVisualization } from './AlgorithmVisualization';
import { PageBase } from '../../../../react-envelope/components/pages/base/PageBase/PageBase';
import { Close, Configure } from '../../../../react-envelope/components/dummies/Icons';

export const AlgLab5 = () => {
  const [algorithmState, setAlgorithmState] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
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
    setIsRunning(true);
    setControls(params);
    const state = runGeneticAlgorithm(params);
    setAlgorithmState(state);
    setIsRunning(false);
  }, []);

  const handleClear = useCallback(() => {
    setAlgorithmState(null);
  }, []);

  return (
    <PageBase>
      <div className={styles.container}>
        <ControlPanel 
          initialValues={controls}
          onSolve={handleSolve}
          onClear={handleClear}
          isRunning={isRunning}
          className={cpv && styles.active}
        />
        <AlgorithmVisualization 
          state={algorithmState}
          controls={controls}
        />
        {cpv ? <Close className={`icon-m pointer ${styles.cpvbtn} fixed`} onClick={() => setCPV(false)}/> : 
          <Configure className={`icon-m pointer ${styles.cpvbtn} fixed`} onClick={() => setCPV(true)}/>}
      </div>
    </PageBase>
  );
};

function runGeneticAlgorithm(params) {
  // 1. Инициализация генератора случайных чисел
  const rng = seededRandom(params.seed);
  
  // 2. Генерация списка задач
  const tasks = Array.from({ length: params.tasksCount }, (_, i) => ({
    id: i + 1,
    time: Math.floor(rng() * (params.maxTaskTime - params.minTaskTime + 1)) + params.minTaskTime
  }));
  
  // 3. Определение интервалов процессоров
  const processorRanges = calculateProcessorRanges(params.processorsCount);
  
  // 4. Создание начального поколения
  let population = createInitialPopulation(params, tasks, rng);
  
  // 5. Оценка начальной популяции
  evaluatePopulation(population, tasks, processorRanges);
  
  // 6. Инициализация лучшего решения
  let bestIndividual = findBestIndividual(population);
  let generationsWithoutImprovement = 0;
  let generationCount = 0;
  
  // 7. Подготовка истории выполнения
  const generations = [createGenerationRecord(0, "Начальное поколение", population, {
    tasks,
    processorRanges,
    totalLoad: tasks.reduce((sum, task) => sum + task.time, 0),
    idealLoad: tasks.reduce((sum, task) => sum + task.time, 0) / params.processorsCount
  })];
  
  // 8. Основной цикл алгоритма
  while (generationsWithoutImprovement < params.generationsWithoutImprovement) {
    generationCount++;
    const newPopulation = [];
    const generationInfo = createGenerationRecord(generationCount, `Поколение ${generationCount}`);
    
    // 9. Элитизм - сохраняем лучшую особь
    const elite = { ...bestIndividual, name: `Элита-G${generationCount}` };
    newPopulation.push(elite);
    generationInfo.individuals.push(elite);
    
    // 10. Заполнение нового поколения
    while (newPopulation.length < params.populationSize) {
      // 11. Выбор родителей
      const parents = selectParents(population, rng);
      
      // 12. Скрещивание
      const crossoverResult = performCrossover(parents, params.crossoverProbability, rng);
      
      // 13. Добавление потомков
      newPopulation.push(...crossoverResult.children);
      generationInfo.crossoverEvents.push(crossoverResult.event);
      generationInfo.individuals.push(...crossoverResult.children);
    }
    
    // 14. Мутации
    for (let i = 1; i < newPopulation.length; i++) {
      if (rng() < params.mutationProbability) {
        const mutationResult = performMutation(newPopulation[i], rng);
        newPopulation[i] = mutationResult.individual;
        generationInfo.mutationEvents.push(mutationResult.event);
      }
    }
    
    // 15. Оценка нового поколения
    evaluatePopulation(newPopulation, tasks, processorRanges);
    population = newPopulation;
    
    // 16. Проверка улучшения
    const currentBest = findBestIndividual(population);
    if (currentBest.fitness < bestIndividual.fitness) {
      bestIndividual = currentBest;
      generationsWithoutImprovement = 0;
      generationInfo.improvement = true;
    } else {
      generationsWithoutImprovement++;
    }
    
    // 17. Сохранение информации о поколении
    generationInfo.bestIndividual = { ...bestIndividual };
    generations.push(generationInfo);
    
    // 18. Проверка на идеальное решение
    if (bestIndividual.fitness <= Math.ceil(generations[0].initialData.idealLoad)) {
      generationInfo.stoppingReason = "Достигнута идеальная нагрузка";
      break;
    }
  }
  
  // 19. Формирование результатов
  return {
    initialData: generations[0].initialData,
    bestIndividual,
    generations,
    totalGenerations: generationCount,
    stoppingReason: generationsWithoutImprovement >= params.generationsWithoutImprovement 
      ? "Неизменность лучшего решения" 
      : "Достигнута идеальная нагрузка",
    tasks
  };
}

// Вспомогательные функции:

function seededRandom(seed) {
  let x = Math.sin(seed) * 10000;
  return () => {
    x = Math.sin(x) * 10000;
    return x - Math.floor(x);
  };
}

function calculateProcessorRanges(processorsCount) {
  const rangeSize = Math.floor(256 / processorsCount);
  return Array.from({ length: processorsCount }, (_, i) => ({
    processor: i,
    min: i * rangeSize,
    max: (i + 1) * rangeSize - (i === processorsCount - 1 ? 0 : 1)
  }));
}

function createInitialPopulation(params, tasks, rng) {
  let individualCounter = 0;
  return Array.from({ length: params.populationSize }, () => {
    individualCounter++;
    return {
      id: individualCounter,
      name: `Начальная-${individualCounter}`,
      genotype: Array.from({ length: tasks.length }, () => Math.floor(rng() * 256)),
      processors: [],
      fitness: Infinity,
      processorLoads: []
    };
  });
}

function evaluatePopulation(population, tasks, processorRanges) {
  population.forEach(individual => {
    // Распределение задач по процессорам
    individual.processors = Array.from({ length: processorRanges.length }, () => []);
    individual.genotype.forEach((gene, taskIdx) => {
      const processor = processorRanges.findIndex(
        range => gene >= range.min && gene <= range.max
      );
      individual.processors[processor].push(tasks[taskIdx]);
    });
    
    // Расчет загрузки процессоров
    individual.processorLoads = individual.processors.map(processorTasks => 
      processorTasks.reduce((sum, task) => sum + task.time, 0)
    );
    
    // Фитнес-функция (максимальная загрузка)
    individual.fitness = Math.max(...individual.processorLoads);
  });
}

function findBestIndividual(population) {
  return population.reduce((best, current) => 
    current.fitness < best.fitness ? current : best
  );
}

function createGenerationRecord(index, name, individuals = [], initialData = null) {
  return {
    index,
    name,
    individuals: [...individuals],
    crossoverEvents: [],
    mutationEvents: [],
    improvement: false,
    ...(initialData && { initialData })
  };
}

function selectParents(population, rng) {
  // Турнирный отбор
  const tournamentSize = Math.min(3, population.length);
  const parents = [];
  
  for (let i = 0; i < 2; i++) {
    const candidates = [];
    for (let j = 0; j < tournamentSize; j++) {
      candidates.push(population[Math.floor(rng() * population.length)]);
    }
    parents.push(candidates.reduce((best, current) => 
      current.fitness < best.fitness ? current : best
    ));
  }
  
  return parents.map((parent, i) => ({
    ...parent,
    selectionName: `Родитель-${i + 1}`
  }));
}

function performCrossover(parents, crossoverProbability, rng) {
  if (rng() < crossoverProbability) {
    // Одноточечный кроссовер
    const crossoverPoint = Math.floor(rng() * parents[0].genotype.length);
    const child1Genotype = [
      ...parents[0].genotype.slice(0, crossoverPoint),
      ...parents[1].genotype.slice(crossoverPoint)
    ];
    const child2Genotype = [
      ...parents[1].genotype.slice(0, crossoverPoint),
      ...parents[0].genotype.slice(crossoverPoint)
    ];
    
    const child1 = createChild(child1Genotype, parents);
    const child2 = createChild(child2Genotype, parents);
    
    return {
      children: [child1, child2],
      event: {
        parents: parents.map(p => ({ id: p.id, name: p.name, fitness: p.fitness })),
        children: [child1, child2].map(c => ({ id: c.id, name: c.name })),
        crossoverPoint,
        beforeGenotypes: parents.map(p => [...p.genotype]),
        afterGenotypes: [child1Genotype, child2Genotype]
      }
    };
  } else {
    // Без кроссовера - копируем родителей
    const child1 = createChild([...parents[0].genotype], parents);
    const child2 = createChild([...parents[1].genotype], parents);
    
    return {
      children: [child1, child2],
      event: {
        parents: parents.map(p => ({ id: p.id, name: p.name, fitness: p.fitness })),
        children: [child1, child2].map(c => ({ id: c.id, name: c.name })),
        crossoverPoint: null,
        operation: "Копирование без изменений"
      }
    };
  }
}

// Выносим счетчик потомков в замыкание
const createChildFactory = () => {
  let childCounter = 0;
  return (genotype, parents) => {
    childCounter++;
    return {
      id: `child-${childCounter}`,
      name: `Потомок-${childCounter}`,
      genotype,
      processors: [],
      fitness: Infinity,
      processorLoads: [],
      parents: parents.map(p => ({ id: p.id, name: p.name }))
    };
  };
};

// Используем фабрику для создания функции
const createChild = createChildFactory();

function performMutation(individual, rng) {
  const geneIndex = Math.floor(rng() * individual.genotype.length);
  const oldValue = individual.genotype[geneIndex];
  const oldBinary = oldValue.toString(2).padStart(8, '0');
  
  // Инвертируем случайный бит
  const bitIndex = Math.floor(rng() * 8);
  const newBinary = oldBinary.split('').map((bit, idx) => 
    idx === bitIndex ? (bit === '0' ? '1' : '0') : bit
  ).join('');
  const newValue = parseInt(newBinary, 2);
  
  // Создаем новую особь
  const newGenotype = [...individual.genotype];
  newGenotype[geneIndex] = newValue;
  const mutatedIndividual = {
    ...individual,
    genotype: newGenotype
  };
  
  return {
    individual: mutatedIndividual,
    event: {
      individual: { id: individual.id, name: individual.name },
      geneIndex,
      oldValue,
      newValue,
      oldBinary,
      newBinary,
      changedBit: bitIndex
    }
  };
}