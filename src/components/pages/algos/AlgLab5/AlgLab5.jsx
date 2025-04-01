import React, { useState, useCallback } from 'react';
import styles from './AlgLab5.module.css';
import { ControlPanel } from './ControlPanel';
import { AlgorithmVisualization } from './AlgorithmVisualization';
import { PageBase } from '../../../../react-envelope/components/pages/base/PageBase/PageBase';
import { Close, Configure } from '../../../../react-envelope/components/dummies/Icons';
import { useAutoHeadings } from '../../../../react-envelope/hooks/useAutoHeadings';

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
    // Здесь будет запуск алгоритма
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
  // Инициализация генератора случайных чисел
  const rng = seededRandom(params.seed);
  
  // Генерация списка задач
  const tasks = Array.from({ length: params.tasksCount }, () => 
    Math.floor(rng() * (params.maxTaskTime - params.minTaskTime + 1)) + params.minTaskTime
  );
  
  // Функция для создания случайной особи
  const createRandomIndividual = () => {
    const genotype = tasks.map(() => Math.floor(rng() * params.processorsCount));
    return createIndividual(genotype);
  };
  
  // Функция создания особи по генотипу
  const createIndividual = (genotype) => {
    // Группируем задачи по процессорам
    const processors = Array.from({ length: params.processorsCount }, () => []);
    genotype.forEach((processorIdx, taskIdx) => {
      processors[processorIdx].push(tasks[taskIdx]);
    });
    
    // Вычисляем фитнес-функцию (максимальная загрузка процессора)
    const fitness = Math.max(...processors.map(processor => 
      processor.reduce((sum, task) => sum + task, 0)
    ));
    
    return { genotype, processors, fitness };
  };
  
  // Турнирный отбор
  const tournamentSelection = (population, tournamentSize = 3) => {
    const selected = [];
    for (let i = 0; i < 2; i++) {
      const candidates = Array.from({ length: tournamentSize }, () => 
        population[Math.floor(rng() * population.length)]
      );
      selected.push(candidates.reduce((best, current) => 
        current.fitness < best.fitness ? current : best
      ));
    }
    return selected;
  };
  
  // Кроссовер
  const crossover = (parent1, parent2) => {
    const crossoverPoint = Math.floor(rng() * tasks.length);
    const child1Genotype = [
      ...parent1.genotype.slice(0, crossoverPoint),
      ...parent2.genotype.slice(crossoverPoint)
    ];
    const child2Genotype = [
      ...parent2.genotype.slice(0, crossoverPoint),
      ...parent1.genotype.slice(crossoverPoint)
    ];
    
    return {
      child1: createIndividual(child1Genotype),
      child2: createIndividual(child2Genotype),
      crossoverPoint
    };
  };
  
  // Мутация
  const mutate = (individual) => {
    const geneIndex = Math.floor(rng() * tasks.length);
    const oldValue = individual.genotype[geneIndex];
    
    // Конвертируем в бинарный вид
    const oldBinary = oldValue.toString(2).padStart(8, '0');
    
    // Выбираем случайный бит для изменения
    const bitIndex = Math.floor(rng() * 8);
    const newBinary = oldBinary.split('').map((bit, idx) => 
      idx === bitIndex ? (bit === '0' ? '1' : '0') : bit
    ).join('');
    
    // Конвертируем обратно в число
    const newValue = parseInt(newBinary, 2) % params.processorsCount;
    
    // Создаем новый генотип
    const newGenotype = [...individual.genotype];
    newGenotype[geneIndex] = newValue;
    
    return {
      individual: createIndividual(newGenotype),
      geneIndex,
      oldValue,
      newValue,
      oldBinary,
      newBinary,
      changedBit: bitIndex
    };
  };
  
  // Создаем начальное поколение
  let population = Array.from({ length: params.populationSize }, createRandomIndividual);
  let bestIndividual = population.reduce((best, current) => 
    current.fitness < best.fitness ? current : best
  );
  let generationsWithoutImprovement = 0;
  let generationCount = 0;
  
  const generations = [];
  
  // Основной цикл алгоритма
  while (generationsWithoutImprovement < params.generationsWithoutImprovement) {
    generationCount++;
    const newPopulation = [];
    const generationInfo = {
      index: generationCount,
      individuals: [],
      crossoverEvents: [],
      mutationEvents: []
    };
    
    // Элитизм - сохраняем лучшую особь
    newPopulation.push(bestIndividual);
    generationInfo.individuals.push(bestIndividual);
    
    // Заполняем новое поколение
    while (newPopulation.length < params.populationSize) {
      // Выбираем родителей
      const [parent1, parent2] = tournamentSelection(population);
      
      // Применяем кроссовер с заданной вероятностью
      if (rng() < params.crossoverProbability) {
        const { child1, child2, crossoverPoint } = crossover(parent1, parent2);
        newPopulation.push(child1, child2);
        
        generationInfo.crossoverEvents.push({
          parents: [parent1.fitness, parent2.fitness],
          children: [child1.fitness, child2.fitness],
          crossoverPoint
        });
        
        generationInfo.individuals.push(child1, child2);
      } else {
        newPopulation.push(parent1, parent2);
        generationInfo.individuals.push(parent1, parent2);
      }
    }
    
    // Применяем мутации
    for (let i = 1; i < newPopulation.length; i++) {
      if (rng() < params.mutationProbability) {
        const mutationResult = mutate(newPopulation[i]);
        newPopulation[i] = mutationResult.individual;
        
        generationInfo.mutationEvents.push({
          individualIndex: i,
          geneIndex: mutationResult.geneIndex,
          oldValue: mutationResult.oldValue,
          newValue: mutationResult.newValue,
          oldBinary: mutationResult.oldBinary,
          newBinary: mutationResult.newBinary,
          changedBit: mutationResult.changedBit
        });
      }
    }
    
    // Обновляем популяцию
    population = newPopulation.slice(0, params.populationSize);
    
    // Находим лучшую особь в новом поколении
    const currentBest = population.reduce((best, current) => 
      current.fitness < best.fitness ? current : best
    );
    
    // Проверяем, улучшилось ли решение
    if (currentBest.fitness < bestIndividual.fitness) {
      bestIndividual = currentBest;
      generationsWithoutImprovement = 0;
    } else {
      generationsWithoutImprovement++;
    }
    
    generations.push(generationInfo);
  }
  
  return {
    bestIndividual,
    bestFitness: bestIndividual.fitness,
    bestGeneration: generationCount - generationsWithoutImprovement,
    generations,
    tasks
  };
}

// Генератор случайных чисел с seed
function seededRandom(seed) {
  let x = Math.sin(seed) * 10000;
  return () => {
    x = Math.sin(x) * 10000;
    return x - Math.floor(x);
  };
}