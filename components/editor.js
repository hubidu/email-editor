
const Editor = (props) => {
    if (typeof window !== 'undefined') {
      const Ace = require('react-ace').default;
      require('brace/mode/javascript');
      require('brace/mode/html');
      require('brace/theme/github');
      require('brace/theme/monokai');
      
      return <Ace {...props}/>
    }
  
    return null;
  }

  export default Editor