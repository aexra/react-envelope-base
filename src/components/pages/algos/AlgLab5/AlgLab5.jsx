import React, { useState, useCallback, useMemo } from 'react';
import styles from './AlgLab5.module.css';
import { ControlPanel } from './ControlPanel';
import { PageBase } from '../../../../react-envelope/components/pages/base/PageBase/PageBase';
import { Close, Configure } from '../../../../react-envelope/components/dummies/Icons';

const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Компонент для отображения особи
const Individual = ({ individual, index, processorRanges, tasks, isBestCandidate }) => {
    const phenotype = useMemo(() => {
        const processorTimes = new Array(processorRanges.length).fill(0);
        individual.genes.forEach((gene, taskIndex) => {
            const processorIndex = processorRanges.findIndex(range => gene >= range[0] && gene < range[1]);
            if (processorIndex !== -1) {
                processorTimes[processorIndex] += tasks[taskIndex];
            }
        });
        return processorTimes;
    }, [individual.genes, processorRanges, tasks]);

    const maxPhenotype = Math.max(...phenotype);

    return (
        <div className={`${styles.individual} ${isBestCandidate ? styles.bestCandidate : ''}`}>
            <h4>Особь #{index + 1} (Макс: {maxPhenotype}) {isBestCandidate && '← Лучшая'}</h4>
            <div className={styles.genes}>
                {individual.genes.map((gene, i) => {
                    const processorIndex = processorRanges.findIndex(range => gene >= range[0] && gene < range[1]);
                    return (
                        <div key={i} className={styles.gene}>
                            <span>Задача {i + 1} ({tasks[i]}): </span>
                            <span>{gene} → P{processorIndex + 1}</span>
                        </div>
                    );
                })}
            </div>
            <div className={styles.phenotype}>
                <strong>Фенотип:</strong>
                {phenotype.map((time, i) => (
                    <span key={i}> P{i + 1}: {time}</span>
                ))}
            </div>
            {individual.parents && (
                <div className={styles.parents}>
                    <strong>Родители:</strong> {individual.parents.join(' и ')}
                </div>
            )}
            {individual.mutation && (
                <div className={styles.mutation}>
                    <strong>Мутация:</strong>
                    <div className={styles.mutationDetails}>
                        <div>Ген {individual.mutation.index}:</div>
                        <div>Десятичное: {individual.mutation.before} → {individual.mutation.after}</div>
                        <div className={styles.binaryCode}>
                            Двоичное:
                            <span dangerouslySetInnerHTML={{ __html: individual.mutation.beforeBits }} />
                            →
                            <span dangerouslySetInnerHTML={{ __html: individual.mutation.afterBits }} />
                        </div>
                        <div>Изменен бит #{individual.mutation.bitIndex}</div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Компонент для отображения поколения
const Generation = ({ generation, processorRanges, tasks, bestPhenotype }) => {
    return (
        <div className={styles.generation}>
            <h3>Поколение {generation.number}</h3>
            <div className={styles.individuals}>
                {generation.individuals.map((individual, i) => (
                    <Individual
                        key={i}
                        individual={individual}
                        index={i}
                        processorRanges={processorRanges}
                        tasks={tasks}
                        isBestCandidate={individual.isBestCandidate}
                    />
                ))}
            </div>
            <div className={styles.best}>
                <strong>Лучший фенотип поколения:</strong> {bestPhenotype}
            </div>
        </div>
    );
};

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
    const [cpv, setCPV] = useState(false);
    const [state, setState] = useState({
        tasks: [],
        processorRanges: [],
        generations: [],
        bestPhenotypes: [],
        isSolving: false,
        currentStep: 0,
    });

    const generateInitialPopulation = (random, size, tasksCount) => {
        return Array.from({ length: size }, () => ({
            genes: Array.from({ length: tasksCount }, () => random.nextInt(0, 255)),
            parents: null,
            mutation: null,
        }));
    };

    const calculateProcessorRanges = (processorsCount) => {
        const rangeSize = Math.floor(256 / processorsCount);
        const ranges = [];
        for (let i = 0; i < processorsCount; i++) {
            const start = i * rangeSize;
            const end = i === processorsCount - 1 ? 256 : (i + 1) * rangeSize;
            ranges.push([start, end]);
        }
        return ranges;
    };

    const calculatePhenotype = (individual, processorRanges, tasks) => {
        const processorTimes = new Array(processorRanges.length).fill(0);
        individual.genes.forEach((gene, taskIndex) => {
            const processorIndex = processorRanges.findIndex(range => gene >= range[0] && gene < range[1]);
            if (processorIndex !== -1) {
                processorTimes[processorIndex] += tasks[taskIndex];
            }
        });
        return Math.max(...processorTimes);
    };

    const crossover = (parent1, parent2, crossoverProbability) => {
        if (Math.random() > crossoverProbability) {
          return [
            { ...parent1, parents: [`Особь ${parent1.index + 1}`] },
            { ...parent2, parents: [`Особь ${parent2.index + 1}`] }
          ];
        }
      
        const crossoverPoint = getRandomInt(1, parent1.genes.length - 1);
        const child1 = {
            genes: [...parent1.genes.slice(0, crossoverPoint), ...parent2.genes.slice(crossoverPoint)],
            parents: [`Особь ${parent1.index + 1}`, `Особь ${parent2.index + 1}`],
            mutation: null,
        };
        const child2 = {
            genes: [...parent2.genes.slice(0, crossoverPoint), ...parent1.genes.slice(crossoverPoint)],
            parents: [`Особь ${parent1.index + 1}`, `Особь ${parent2.index + 1}`],
            mutation: null,
        };

        return [child1, child2];
    };

    const mutate = (individual, mutationProbability) => {
        if (Math.random() > mutationProbability) {
          return individual;
        }
      
        const geneIndex = getRandomInt(0, individual.genes.length - 1);
        const bitIndex = getRandomInt(0, 7);
        const before = individual.genes[geneIndex];

        // Конвертируем в двоичное представление с ведущими нулями
        const beforeBinary = before.toString(2).padStart(8, '0');

        const mask = 1 << bitIndex;
        const after = before ^ mask;

        // Конвертируем в двоичное представление с ведущими нулями
        const afterBinary = after.toString(2).padStart(8, '0');

        // Подсветим измененный бит
        let beforeBits = beforeBinary.split('');
        let afterBits = afterBinary.split('');

        beforeBits[7 - bitIndex] = `<span class="${styles.changedBit}">${beforeBits[7 - bitIndex]}</span>`;
        afterBits[7 - bitIndex] = `<span class="${styles.changedBit}">${afterBits[7 - bitIndex]}</span>`;

        return {
            ...individual,
            genes: [
                ...individual.genes.slice(0, geneIndex),
                after,
                ...individual.genes.slice(geneIndex + 1),
            ],
            mutation: {
                index: geneIndex + 1,
                before,
                after,
                beforeBinary,
                afterBinary,
                bitIndex: 7 - bitIndex, // Нумерация битов справа налево (0-7)
                beforeBits: beforeBits.join(''),
                afterBits: afterBits.join(''),
            },
        };
    };

    const handleSolve = useCallback((params) => {
        // Валидация параметров
        if (params.minTaskTime > params.maxTaskTime) {
          alert("Минимальное время не может быть больше максимального");
          return;
        }
      
        setControls(params);
        setState(prev => ({ ...prev, isSolving: true }));
      
        // Генерация задач
        const tasks = Array.from({ length: params.tasksCount }, () => 
          getRandomInt(params.minTaskTime, params.maxTaskTime)
        );
      
        // Расчет интервалов процессоров (без изменений)
        const processorRanges = calculateProcessorRanges(params.processorsCount);
      
        // Генерация начальной популяции
        const initialPopulation = Array.from({ length: params.populationSize }, () => ({
          genes: Array.from({ length: params.tasksCount }, () => getRandomInt(0, 255)),
          parents: null,
          mutation: null
        }));

        // Расчет фенотипов для начальной популяции
        const initialGeneration = {
            number: 1,
            individuals: initialPopulation,
        };

        const bestPhenotypes = [];
        const generations = [initialGeneration];

        // Расчет лучшего фенотипа для начального поколения
        let bestPhenotype = Infinity;
        initialPopulation.forEach(individual => {
            const phenotype = calculatePhenotype(individual, processorRanges, tasks);
            if (phenotype < bestPhenotype) {
                bestPhenotype = phenotype;
            }
        });
        bestPhenotypes.push(bestPhenotype);

        // Основной цикл генетического алгоритма
        let generationsWithoutImprovement = 0;
        let currentGeneration = 1;

        while (generationsWithoutImprovement < params.generationsWithoutImprovement) {
            currentGeneration++;
            const lastGeneration = generations[generations.length - 1];
            const newIndividuals = [];

            // Скрещивание с отбором лучшей особи из родителя и потомков
            for (let i = 0; i < lastGeneration.individuals.length; i++) {
                const parent1 = { ...lastGeneration.individuals[i], index: i };
                let j;
                do {
                    j = getRandomInt(0, lastGeneration.individuals.length - 1);
                } while (j === i);
                const parent2 = { ...lastGeneration.individuals[j], index: j };

                // Скрещивание
                const [child1, child2] = crossover(parent1, parent2, params.crossoverProbability);

                // Мутация
                const mutatedChild1 = mutate(child1, params.mutationProbability);
                const mutatedChild2 = mutate(child2, params.mutationProbability);

                // Вычисляем фенотипы для всех трех особей (родитель и два потомка)
                const parentPhenotype = calculatePhenotype(parent1, processorRanges, tasks);
                const child1Phenotype = calculatePhenotype(mutatedChild1, processorRanges, tasks);
                const child2Phenotype = calculatePhenotype(mutatedChild2, processorRanges, tasks);

                // Выбираем лучшую особь из трех
                const candidates = [
                    { individual: parent1, phenotype: parentPhenotype },
                    { individual: mutatedChild1, phenotype: child1Phenotype },
                    { individual: mutatedChild2, phenotype: child2Phenotype },
                ];

                candidates.sort((a, b) => a.phenotype - b.phenotype);
                const bestCandidate = candidates[0].individual;

                // Добавляем лучшую особь в новое поколение
                newIndividuals.push(bestCandidate);
            }

            const newGeneration = {
                number: currentGeneration,
                individuals: newIndividuals,
            };

            generations.push(newGeneration);

            // Находим лучший фенотип в новом поколении
            const currentBestPhenotype = Math.min(
                ...newIndividuals.map(ind => calculatePhenotype(ind, processorRanges, tasks))
            );
            bestPhenotypes.push(currentBestPhenotype);

            // Проверка улучшения
            if (currentBestPhenotype < bestPhenotype) {
                bestPhenotype = currentBestPhenotype;
                generationsWithoutImprovement = 0;
            } else {
                generationsWithoutImprovement++;
            }
        }

        setState({
            tasks,
            processorRanges,
            generations,
            bestPhenotypes,
            isSolving: false,
            currentStep: 0,
        });
    }, []);

    const handleClear = useCallback(() => {
        setState({
            tasks: [],
            processorRanges: [],
            generations: [],
            bestPhenotypes: [],
            isSolving: false,
            currentStep: 0,
        });
    }, []);

    return (
        <PageBase>
            <div className={styles.container}>
                <ControlPanel
                    initialValues={controls}
                    onSolve={handleSolve}
                    onClear={handleClear}
                    className={cpv && styles.active}
                    isSolving={state.isSolving}
                />
                {cpv ? (
                    <Close className={`icon-m pointer ${styles.cpvbtn} fixed`} onClick={() => setCPV(false)} />
                ) : (
                    <Configure className={`icon-m pointer ${styles.cpvbtn} fixed`} onClick={() => setCPV(true)} />
                )}

                <div className={styles.results}>
                    {state.tasks.length > 0 && (
                        <div className={styles.tasks}>
                            <h3>Сгенерированные задачи</h3>
                            <div className={styles.taskList}>
                                {state.tasks.map((task, i) => (
                                    <div key={i}>Задача {i + 1}: {task}</div>
                                ))}
                            </div>
                        </div>
                    )}

                    {state.processorRanges.length > 0 && (
                        <div className={styles.processors}>
                            <h3>Интервалы процессоров</h3>
                            <div className={styles.processorRanges}>
                                {state.processorRanges.map((range, i) => (
                                    <div key={i}>P{i + 1}: [{range[0]}, {range[1]})</div>
                                ))}
                            </div>
                        </div>
                    )}

                    {state.generations.length > 0 && (
                        <div className={styles.generations}>
                            <h2>Генетический алгоритм</h2>
                            {state.generations.map((generation, i) => (
                                <Generation
                                    key={i}
                                    generation={generation}
                                    processorRanges={state.processorRanges}
                                    tasks={state.tasks}
                                    bestPhenotype={state.bestPhenotypes[i]}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </PageBase>
    );
};