import { useState } from 'react';
import { TMBForm } from '../components/TMBForm';
import { TMBResult } from '../components/TMBResult';
import { ErrorAlert } from '../components/ErrorAlert';
import { useTMB } from '../hooks/useTMB';
import type { TMBFormData } from '../types/index';
import './Calculator.css';

export function Calculator() {
  const { loading, error, result, calculateTMB, clearResult } = useTMB();
  const [dismissedError, setDismissedError] = useState(false);

  const handleSubmit = async (data: TMBFormData) => {
    setDismissedError(false);
    await calculateTMB(data);
  };

  const handleReset = () => {
    clearResult();
    setDismissedError(false);
  };

  const handleDismissError = () => {
    setDismissedError(true);
  };

  return (
    <main className="calculator-main">
      <div className="calculator-container">
        <section className="calculator-section">
          <div className="session-intro">
            <h2>Calculadora de TMB</h2>
            <p>
              Use esta sessão para calcular sua Taxa Metabólica Basal e comparar necessidades
              calóricas por nível de atividade.
            </p>
          </div>
          {!result ? (
            <>
              {error && !dismissedError && (
                <ErrorAlert message={error} onDismiss={handleDismissError} />
              )}
              <TMBForm onSubmit={handleSubmit} loading={loading} />
            </>
          ) : (
            <TMBResult result={result} onReset={handleReset} />
          )}
        </section>

        <section className="info-section">
          <div className="info-card">
            <h3>O que é TMB?</h3>
            <p>
              Taxa Metabólica Basal (TMB) é a quantidade de calorias que seu corpo queima
              em repouso para manter as funções vitais como respiração, circulação e
              temperatura corporal.
            </p>
          </div>

          <div className="info-card">
            <h3>Fórmula de Mifflin-St Jeor</h3>
            <p>
              A fórmula de Mifflin-St Jeor é considerada uma das mais precisas para
              calcular a TMB, levando em consideração peso, altura, idade e sexo.
            </p>
          </div>

          <div className="info-card">
            <h3>Como usar o resultado?</h3>
            <p>
              Multiplique seu TMB pelos níveis de atividade para descobrir quantas
              calorias você precisa consumir diariamente para manter, ganhar ou perder peso.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
