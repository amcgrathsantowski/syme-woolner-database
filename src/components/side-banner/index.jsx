export default function SideBanner() {
  return (
    <div
      className="winter-green-bg"
      style={{
        width: '60%',
        color: 'white',
        fontSize: '3rem',
        overflow: 'hidden',
        fontWeight: 'bold',
        borderRadius: '0 30px 30px 0',
        boxShadow: '0 3px 20px #000',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <h1
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <div
          style={{
            fontFamily: `'Poppins ExtraBold 800', sans-serif`,
            textShadow: '2px 4px 20px #000'
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              fontSize: 'larger'
            }}
          >
            SYME
            <img
              src="./woolner.png"
              alt="Company Logo"
              loading="lazy"
            />
          </div>
          WOOLNER
        </div>
      </h1>
      <div
        style={{
          fontWeight: 'normal'
        }}
      >
        <hr
          style={{
            color: 'inherit',
            backgroundColor: 'white',
            maxWidth: '90%',
            width: '100%',
            height: '3px',
            borderRadius: '5px',
            boxShadow: '0 5px 15px #000'
          }}
        />
        <p>Neighbourhood & Family Centre</p>
      </div>
    </div>
  );
}
