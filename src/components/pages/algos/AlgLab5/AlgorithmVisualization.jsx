import React from 'react';
import styles from './AlgLab5.module.css';

// Компонент для отображения начальных данных
export const InitialDataVisualization = ({ initialData, processorRanges }) => (
    <div className={styles.section}>
        <h3>Исходные данные</h3>

        <div className={styles.subSection}>
            <h4>Список задач</h4>
            <div className={styles.tasksGrid}>
                {initialData.tasks.map(task => (
                    <div key={task.id} className={styles.taskCard}>
                        <span>Задача {task.id}</span>
                        <span>{task.time} мс</span>
                    </div>
                ))}
            </div>
            <p>Общая нагрузка: {initialData.totalLoad} мс</p>
            <p>Идеальная нагрузка на процессор: ~{initialData.idealLoad.toFixed(1)} мс</p>
        </div>

        <div className={styles.subSection}>
            <h4>Интервалы процессоров</h4>
            <div className={styles.rangesGrid}>
                {processorRanges.map(range => (
                    <div key={range.processor} className={styles.rangeCard}>
                        <h5>Процессор {range.processor}</h5>
                        <p>Десятичный: [{range.min}, {range.max}]</p>
                        <p>Двоичный: [{range.binaryRange.min}, {range.binaryRange.max}]</p>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

// Компонент для отображения особи
const IndividualVisualization = ({ individual, showDetails }) => (
    <div className={styles.individual}>
        <div className={styles.individualHeader}>
            <h4>{individual.name}</h4>
            <span className={styles.fitnessBadge}>{individual.fitness} мс</span>
        </div>

        {showDetails && (
            <>
                <div className={styles.genotype}>
                    <h5>Генотип:</h5>
                    <div className={styles.genes}>
                        {individual.genotype.map((gene, idx) => (
                            <div key={idx} className={styles.gene}>
                                <span>Задача {idx + 1}:</span>
                                <span>{gene} ({gene.toString(2).padStart(8, '0')})</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.processors}>
                    <h5>Распределение задач:</h5>
                    {individual.processors.map((tasks, idx) => (
                        <div key={idx} className={styles.processor}>
                            <div className={styles.processorHeader}>
                                <span>Процессор {idx + 1}</span>
                                <span>{individual.processorLoads[idx]} мс</span>
                            </div>
                            <div className={styles.processorTasks}>
                                {tasks.map(task => (
                                    <span key={task.id} className={styles.task}>
                                        {task.id}:{task.time}мс
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </>
        )}
    </div>
);

// Компонент для отображения события кроссовера
const CrossoverEventVisualization = ({ event }) => (
    <div className={styles.event}>
        <h4>🔀 Кроссовер между {event.parents[0].name} и {event.parents[1].name}</h4>

        <div className={styles.parents}>
            {event.parents.map(parent => (
                <IndividualVisualization
                    key={parent.id}
                    individual={parent}
                    showDetails={false}
                />
            ))}
        </div>

        <div className={styles.crossoverDetails}>
            <p>Точка разрыва: {event.crossoverPoint}</p>
            <div className={styles.genotypeComparison}>
                <div>
                    <h5>Родитель 1:</h5>
                    <code>{event.beforeGenotypes[0].join(', ')}</code>
                </div>
                <div>
                    <h5>Родитель 2:</h5>
                    <code>{event.beforeGenotypes[1].join(', ')}</code>
                </div>
            </div>
            <div className={styles.arrow}>↓</div>
            <div className={styles.genotypeComparison}>
                <div>
                    <h5>Потомок 1:</h5>
                    <code>{event.afterGenotypes[0].join(', ')}</code>
                </div>
                <div>
                    <h5>Потомок 2:</h5>
                    <code>{event.afterGenotypes[1].join(', ')}</code>
                </div>
            </div>
        </div>
    </div>
);

// Компонент для отображения события мутации
const MutationEventVisualization = ({ event }) => (
    <div className={styles.event}>
        <h4>🧬 Мутация особи {event.individual.name}</h4>

        <div className={styles.mutationDetails}>
            <div className={styles.mutationGene}>
                <h5>Изменен ген для задачи {event.taskId}:</h5>
                <div className={styles.binaryChange}>
                    <code>{event.oldBinary}</code>
                    <span>→</span>
                    <code>{event.newBinary}</code>
                </div>
                <p>Изменен бит {event.changedBit} (индекс с 0)</p>
                <p>Десятичное значение: {event.oldValue} → {event.newValue}</p>
            </div>
        </div>
    </div>
);

// Компонент для отображения поколения
const GenerationVisualization = ({ generation }) => (
    <div className={styles.generation}>
        <div className={styles.generationHeader}>
            <h3>{generation.name}</h3>
            {generation.improvement && (
                <span className={styles.improvementBadge}>Улучшение!</span>
            )}
        </div>

        <div className={styles.individualsGrid}>
            {generation.individuals.map(ind => (
                <IndividualVisualization
                    key={ind.id}
                    individual={ind}
                    showDetails={generation.index === 0}
                />
            ))}
        </div>

        {generation.crossoverEvents.map((event, idx) => (
            <CrossoverEventVisualization key={`crossover-${idx}`} event={event} />
        ))}

        {generation.mutationEvents.map((event, idx) => (
            <MutationEventVisualization key={`mutation-${idx}`} event={event} />
        ))}
    </div>
);

// Основной компонент визуализации
export const AlgorithmVisualization = ({ state, controls }) => {
    if (!state) return (
        <div className={styles.visualization}>
            <div className={styles.placeholder}>
                <p>Установите параметры и нажмите "Решить" для запуска алгоритма</p>
            </div>
        </div>
    );

    return (
        <div className={styles.visualization}>
            <InitialDataVisualization
                initialData={state.initialData}
                processorRanges={calculateProcessorRanges(controls.processorsCount)}
            />

            <div className={styles.resultsSection}>
                <h3>Результаты работы алгоритма</h3>
                <div className={styles.summary}>
                    <div className={styles.bestSolution}>
                        <h4>Лучшее решение: {state.bestIndividual.name}</h4>
                        <IndividualVisualization
                            individual={state.bestIndividual}
                            showDetails={true}
                        />
                    </div>
                    <div className={styles.algorithmStats}>
                        <p>Всего поколений: {state.totalGenerations}</p>
                        <p>Причина остановки: {state.stoppingReason}</p>
                        <p>Лучший фитнес: {state.bestIndividual.fitness} мс</p>
                    </div>
                </div>
            </div>

            <div className={styles.generationsList}>
                <h3>Ход выполнения</h3>
                {state.generations.map(gen => (
                    <GenerationVisualization key={gen.index} generation={gen} />
                ))}
            </div>
        </div>
    );
};

// Вспомогательная функция для расчета интервалов
function calculateProcessorRanges(processorsCount) {
    const rangeSize = Math.floor(256 / processorsCount);
    return Array.from({ length: processorsCount }, (_, i) => {
        const min = i * rangeSize;
        const max = (i + 1) * rangeSize - (i === processorsCount - 1 ? 0 : 1);
        return {
            processor: i + 1,
            min,
            max,
            binaryRange: {
                min: min.toString(2).padStart(8, '0'),
                max: max.toString(2).padStart(8, '0')
            }
        };
    });
}