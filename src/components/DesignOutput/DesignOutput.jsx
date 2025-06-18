export default function DesignOutput({ designs }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '1rem',
      marginTop: '2rem'
    }}>
      {designs.map((design, index) => (
        <div key={index} style={{
          border: '1px solid #e2e8f0',
          borderRadius: '0.5rem',
          overflow: 'hidden',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            padding: '1rem',
            borderBottom: '1px solid #e2e8f0',
            backgroundColor: '#f7fafc',
            fontWeight: '600'
          }}>
            {design.title}
          </div>
          <div style={{ padding: '1rem' }}>
            <img 
              src={design.image} 
              alt={design.title}
              style={{
                width: '100%',
                height: 'auto',
                borderRadius: '0.25rem'
              }} 
            />
            <p style={{ margin: '0.5rem 0 1rem 0' }}>{design.summary}</p>
            <ul style={{
              paddingLeft: '1.25rem',
              margin: 0,
              listStyleType: 'disc'
            }}>
              {design.highlights.map((h, i) => (
                <li key={i} style={{ marginBottom: '0.25rem' }}>{h}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}