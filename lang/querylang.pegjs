{
  function combine(left, right) {

    if (right === null) return left;
   
    return left + " " + right[0] + " " +right[1];
  }
}

start = ex:andExpression {return 'return '+ex+';';}

andExpression
 = left:orExpression right:(and andExpression)? {return combine(left,right);}

orExpression
 = left:expression right:(or andExpression)?  {return combine(left,right);}

expression
 = name:string value:(':' string)? { 
if (value === null) return 'LangParser.hasValue(obj,\''+name+'\')';
else return 'LangParser.hasKeyValue(obj,\''+name+'\', \''+value[1]+'\')';
}

string "string"
  = chars:char* { return chars.join(""); }

char
  = [a-zA-Z0-9]

and "AND" = ws 'AND'i ws {return '&&';}
or = ws 'OR'i ws {return '||';}

ws "whitespace" = [ \t\n\r]*