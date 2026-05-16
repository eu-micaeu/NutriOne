import './Footer.css';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <p>
            <strong>NutriOne</strong> - Calculadora de TMB
          </p>
          <p className="footer-info">
            Utilizamos a fórmula de <strong>Mifflin-St Jeor</strong> para cálculo da TMB.
          </p>
          <p className="footer-disclaimer">
            As estimativas são educativas e podem variar bastante. Consulte um profissional de saúde para orientação personalizada.
          </p>
        </div>
        <p className="footer-copyright">
          © {currentYear} NutriOne. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
