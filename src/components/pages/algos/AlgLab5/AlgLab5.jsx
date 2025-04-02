import React, { useState, useCallback, useMemo } from 'react';
import css from './AlgLab5.module.css';
import { ControlPanel } from './ControlPanel';
import { PageBase } from '../../../../react-envelope/components/pages/base/PageBase/PageBase';
import { Close, Configure, Crossover, Dna } from '../../../../react-envelope/components/dummies/Icons';
import { Headline } from '../../../../react-envelope/components/ui/labels/Headline/Headline';
import { Pair } from '../../../../react-envelope/components/layouts/Pair/Pair';
import { StatusTag } from '../../../../react-envelope/components/ui/labels/StatusTag/StatusTag';
import { Expander } from '../../../../react-envelope/components/wrappers/Expander/Expander';
import { Callout } from '../../../../react-envelope/components/dummies/Callout/Callout';

const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Компонент для отображения особи
const Individual = ({ individual, index, processorRanges, tasks }) => {
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

    // Расчет распределения задач по процессорам
    const processorTaskDistribution = useMemo(() => {
        const distribution = processorRanges.map(() => []);
        individual.genes.forEach((gene, taskIndex) => {
            const processorIndex = processorRanges.findIndex(range => gene >= range[0] && gene < range[1]);
            if (processorIndex !== -1) {
                distribution[processorIndex].push({
                    task: taskIndex + 1,
                    weight: tasks[taskIndex],
                });
            }
        });
        return distribution;
    }, [individual.genes, processorRanges, tasks]);

    return (
        <div className={`${css.individual} ${individual.isBestCandidate ? css.bestCandidate : ''}`}>
            <h4>{`Особь #${index + 1}`}<accent>{maxPhenotype}</accent> {individual.isBestCandidate && <StatusTag className={'h-last'} type={'success'}>Лучшая</StatusTag>}</h4>
            <table className={css.geneTable}>
                <thead>
                    <tr>
                        <th>Задача</th>
                        {tasks.map((task, i) => (
                            <th key={i}>#{i + 1}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {/* Индексы задач */}
                    <tr>
                        <td>Индекс</td>
                        {tasks.map((task, i) => (
                            <td key={i}>{i + 1}</td>
                        ))}
                    </tr>
                    {/* Веса задач */}
                    <tr>
                        <td>Вес</td>
                        {tasks.map((task, i) => (
                            <td key={i}>{task}</td>
                        ))}
                    </tr>
                    {/* Гены особи */}
                    <tr>
                        <td>Ген</td>
                        {individual.genes.map((gene, i) => (
                            <td key={i}>{gene}</td>
                        ))}
                    </tr>
                </tbody>
            </table>
            {/* Таблица распределения задач по процессорам */}
            <h5>Распределение задач по процессорам</h5>
            <table className={css.processorDistributionTable}>
                <thead>
                    <tr>
                        {processorRanges.map((_, i) => (
                            <th key={i}>P{i + 1}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        {processorTaskDistribution.map((tasksOnProcessor, i) => (
                            <td key={i}>
                                {tasksOnProcessor.length > 0 ? (
                                    <ul>
                                        {tasksOnProcessor.map((task, j) => (
                                            <li key={j}>
                                                {task.weight}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    'Нет задач'
                                )}
                            </td>
                        ))}
                    </tr>
                    <tr>
                        {phenotype.map((time, i) => (
                            <td key={i}>{time}</td>
                        ))}
                    </tr>
                </tbody>
            </table>
            <div className={css.phenotype}>
                <strong>Фенотип:</strong>
                <div className='flex row g5'>
                    {phenotype.map((time, i) => (
                        <span key={i}>{time}</span>
                    ))}
                </div>

            </div>
            {individual.parents && (
                <div className={css.parents}>
                    <strong>Родители:</strong> {individual.parents.join(' и ')}
                </div>
            )}
            {individual.mutation && (
                <div className={css.mutation}>
                    <strong>Мутация:</strong>
                    <div className={css.mutationDetails}>
                        <div>Ген {individual.mutation.index}:</div>
                        <div>Десятичное: {individual.mutation.before} → {individual.mutation.after}</div>
                        <div className={css.binaryCode}>
                            Двоичное:
                            <span dangerouslySetInnerHTML={{ __html: individual.mutation.beforeBits }} />
                            →
                            <span dangerouslySetInnerHTML={{ __html: individual.mutation.afterBits }} />
                        </div>
                        <div>Изменен бит #{individual.mutation.bitIndex}</div>
                        <div>
                            Фенотип до мутации: <accent>{individual.mutation.beforePhenotype}</accent>
                        </div>
                        <div>
                            Гены до мутации:
                            <div className={`flex row g5`}>
                                {individual.mutation.beforeGenes.map((gene, i) => (
                                    <div key={i}>
                                        {gene}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Компонент для отображения поколения
const Generation = ({ generation, processorRanges, tasks, bestPhenotype }) => {
    return (
        <Callout type='grey' title={<h3>Поколение {generation.number}</h3>} icon={<Dna/>}>
            <div className={css.generation}>
                <Pair left={<h3>Поколение {generation.number}</h3>} right={<accent className={css.bestphengenmark}>{bestPhenotype}</accent>} />

                {/* Информация о скрещиваниях */}
                {generation.crossovers &&
                    <div className={`flex col g5 ${css.crossover}`}>
                        {generation.crossovers.map((crossover, i) => (
                            <CrossoverDetails key={i} crossover={crossover} processorRanges={processorRanges} tasks={tasks} />
                        ))}
                    </div>
                }

                {/* Особи текущего поколения */}
                <div className={css.individuals}>
                    {generation.individuals.map((individual, i) => (
                        <Individual
                            key={i}
                            individual={individual}
                            index={i}
                            processorRanges={processorRanges}
                            tasks={tasks}
                        />
                    ))}
                </div>

                <div className={css.best}>
                    <strong>Лучший фенотип поколения:</strong> {bestPhenotype}
                </div>
            </div>
        </Callout>
    );
};

const CrossoverDetails = ({ crossover, processorRanges, tasks }) => {
    return (
        <Callout title={'Кроссовер'} icon={<Crossover />}>
            <div className={css.crossover}>
                <h5>Скрещивание</h5>
                <div className={css.parents}>
                    <strong>Родители:</strong>
                    <div className='flex row g20'>
                        <Individual individual={crossover.parents[0]} index={crossover.parents[0].index} processorRanges={processorRanges} tasks={tasks} />
                        <Individual individual={crossover.parents[1]} index={crossover.parents[1].index} processorRanges={processorRanges} tasks={tasks} />
                    </div>
                </div>
                <div className={css.children}>
                    <strong>Дети:</strong>
                    <div className='flex row g20'>
                        <Individual individual={crossover.children[0]} index={-1} processorRanges={processorRanges} tasks={tasks} />
                        <Individual individual={crossover.children[1]} index={-1} processorRanges={processorRanges} tasks={tasks} />
                    </div>
                </div>
                <div className={css.selected}>
                    <strong>Выбранная особь:</strong>
                    <Individual individual={crossover.selected} index={-1} processorRanges={processorRanges} tasks={tasks} />
                </div>
            </div>
        </Callout>
    );
};

export const AlgLab5 = () => {
    const [controls, setControls] = useState({
        seed: 1,
        minTaskTime: 1,
        maxTaskTime: 200,
        processorsCount: 5,
        tasksCount: 7,
        populationSize: 4,
        generationsWithoutImprovement: 5,
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

        // Сохраняем исходное состояние генов
        const beforeGenes = [...individual.genes];

        // Выполняем мутацию
        const geneIndex = getRandomInt(0, individual.genes.length - 1);
        const bitIndex = getRandomInt(0, 7);
        const before = individual.genes[geneIndex];
        const mask = 1 << bitIndex;
        const after = before ^ mask;

        const beforeBinary = before.toString(2).padStart(8, '0');
        const afterBinary = after.toString(2).padStart(8, '0');

        let beforeBits = beforeBinary.split('');
        let afterBits = afterBinary.split('');
        beforeBits[7 - bitIndex] = `<span class="${css.changedBit}">${beforeBits[7 - bitIndex]}</span>`;
        afterBits[7 - bitIndex] = `<span class="${css.changedBit}">${afterBits[7 - bitIndex]}</span>`;

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
                beforeGenes, // Сохраняем исходные гены
            },
        };
    };

    const markBest = (ind) => {
        return {
            ...ind,
            isBestCandidate: true
        }
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
        })).map(ind => ({
            ...ind,
            phenotype: calculatePhenotype(ind, processorRanges, tasks)
        }));

        // Расчет лучшего фенотипа для начального поколения
        const bestPhenotypes = [];
        let bestPhenotype = Infinity;
        initialPopulation.forEach(individual => {
            const phenotype = calculatePhenotype(individual, processorRanges, tasks);
            if (phenotype < bestPhenotype) {
                bestPhenotype = phenotype;
            }
        });
        bestPhenotypes.push(bestPhenotype);

        const generations = [{
            number: 1,
            individuals: initialPopulation.map(ind => ind.phenotype == bestPhenotype ? markBest(ind) : ind)
        }];

        // Основной цикл генетического алгоритма
        let generationsWithoutImprovement = 0;
        let currentGeneration = 1;

        while (generationsWithoutImprovement < params.generationsWithoutImprovement) {
            currentGeneration++;
            const lastGeneration = generations[generations.length - 1];
            var newIndividuals = [];
            const crossovers = []; // Новое поле для хранения информации о скрещиваниях

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
                const mutatedChild1 = mutate(child1, params.mutationProbability, processorRanges, tasks);
                const mutatedChild2 = mutate(child2, params.mutationProbability, processorRanges, tasks);

                // Вычисляем фенотипы
                const parentPhenotype = calculatePhenotype(parent1, processorRanges, tasks);
                const child1Phenotype = calculatePhenotype(mutatedChild1, processorRanges, tasks);
                const child2Phenotype = calculatePhenotype(mutatedChild2, processorRanges, tasks);

                // Выбираем лучшую особь
                const candidates = [
                    { individual: parent1, phenotype: parentPhenotype },
                    { individual: mutatedChild1, phenotype: child1Phenotype },
                    { individual: mutatedChild2, phenotype: child2Phenotype },
                ];
                candidates.sort((a, b) => a.phenotype - b.phenotype);
                const bestCandidate = candidates[0].individual;

                // Сохраняем информацию о скрещивании
                crossovers.push({
                    parents: [parent1, parent2],
                    children: [mutatedChild1, mutatedChild2],
                    selected: bestCandidate,
                });

                // Добавляем лучшую особь в новое поколение
                newIndividuals.push({
                    ...bestCandidate,
                    phenotype: candidates[0].phenotype,
                });
            }

            // Находим лучший фенотип в новом поколении
            const currentBestPhenotype = Math.min(
                ...newIndividuals.map(ind => calculatePhenotype(ind, processorRanges, tasks))
            );
            bestPhenotypes.push(currentBestPhenotype);
            newIndividuals = newIndividuals.map(ind => ind.phenotype == currentBestPhenotype ? markBest(ind) : ind);

            const newGeneration = {
                number: currentGeneration,
                individuals: newIndividuals,
                crossovers, // Добавляем информацию о скрещиваниях
            };
            generations.push(newGeneration);

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

        console.log({
            tasks,
            processorRanges,
            generations,
            bestPhenotypes
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
            <div className={css.container}>
                <ControlPanel
                    initialValues={controls}
                    onSolve={handleSolve}
                    onClear={handleClear}
                    className={cpv && css.active}
                    isSolving={state.isSolving}
                />
                {cpv ? (
                    <Close className={`icon-m pointer ${css.cpvbtn} fixed`} onClick={() => setCPV(false)} />
                ) : (
                    <Configure className={`icon-m pointer ${css.cpvbtn} fixed`} onClick={() => setCPV(true)} />
                )}
                {state.tasks.length > 0 &&
                    <div className={css.results}>
                        <Headline>Исходные данные</Headline>

                        {state.tasks.length > 0 && (
                            <div className={`${css.tasks} ${css.section}`}>
                                <h3>Сгенерированные задачи</h3>
                                {/* <div className={css.taskList}>
                                    {state.tasks.map((task, i) => (
                                        <div key={i}>Задача {i + 1}: {task}</div>
                                    ))}
                                </div> */}
                                <table className={`${css.tasktable}`} border="1" cellPadding="5" cellSpacing="0">
                                    <thead>
                                        <tr>
                                            {state.tasks.map((_, index) => (
                                                <th key={index}>{index + 1}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            {state.tasks.map((value, index) => (
                                                <td key={index}><accent>{value}</accent></td>
                                            ))}
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {state.processorRanges.length > 0 && (
                            <div className={`${css.processors} ${css.section}`}>
                                <h3>Интервалы</h3>
                                <div className={`${css.processorRanges} flex col g5`}>
                                    {state.processorRanges.map((range, i) => (
                                        <div key={i}>P{i + 1}: <accent>[{range[0]}, {range[1]}]</accent></div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <Headline>Результат</Headline>
                        <div className={`${css.section}`}>
                            <Pair left={'Поколений: '} right={<accent className='accent-color'>{state.generations.length}</accent>} />
                            <Pair left={'Лучший фенотип: '} right={<span>
                                {<accent>{state.bestPhenotypes[0]}</accent>}
                                {` → `}
                                {<accent>{state.bestPhenotypes.findLast(_ => true)}</accent>}
                            </span>} />

                            <h3>Лучшая особь</h3>
                            <Individual
                                index={''}
                                individual={state.generations.findLast(_ => true).individuals.reduce((m, c) => c.phenotype < m.phenotype ? c : m)}
                                processorRanges={state.processorRanges}
                                tasks={state.tasks} />
                        </div>

                        {state.generations.length > 0 && (
                            <div className={css.generations}>
                                <Headline>Ход работы</Headline>
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
                }
            </div>
        </PageBase>
    );
};