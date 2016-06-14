'use strict';

var _staticRequire = require('../core/staticRequire');

var _staticRequire2 = _interopRequireDefault(_staticRequire);

var _lodash = require('lodash.findindex');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/**
 * @fileoverview Rule to enforce new line after import not followed by another import.
 * @author Radek Benkel
 */

function containsNodeOrEqual(outerNode, innerNode) {
  return outerNode.range[0] <= innerNode.range[0] && outerNode.range[1] >= innerNode.range[1];
}

function getScopeBody(scope) {
  var body = scope.block.body;


  if (body.type === 'BlockStatement') {
    return body.body;
  }

  return body;
}

function findNodeIndexInScopeBody(scope, nodeToFind) {
  var body = getScopeBody(scope);

  return (0, _lodash2.default)(body, function (node) {
    return containsNodeOrEqual(node, nodeToFind);
  });
}

function getLineDifference(node, nextNode) {
  return nextNode.loc.start.line - node.loc.end.line;
}

module.exports = function (context) {
  var scopes = [];
  var scopeIndex = 0;

  function checkForNewLine(node, nextNode, type) {
    if (getLineDifference(node, nextNode) < 2) {
      var column = node.loc.start.column;

      if (node.loc.start.line !== node.loc.end.line) {
        column = 0;
      }

      context.report({
        loc: {
          line: node.loc.end.line,
          column: column
        },
        message: 'Expected empty line after ' + type + ' statement not followed by another ' + type + '.'
      });
    }
  }

  return {
    ImportDeclaration: function ImportDeclaration(node) {
      var parent = node.parent;

      var nodePosition = parent.body.indexOf(node);
      var nextNode = parent.body[nodePosition + 1];

      if (nextNode && nextNode.type !== 'ImportDeclaration') {
        checkForNewLine(node, nextNode, 'import');
      }
    },
    Program: function Program() {
      scopes.push({ scope: context.getScope(), requireCalls: [] });
    },
    CallExpression: function CallExpression(node) {
      var scope = context.getScope();
      if ((0, _staticRequire2.default)(node)) {
        var currentScope = scopes[scopeIndex];

        if (scope === currentScope.scope) {
          currentScope.requireCalls.push(node);
        } else {
          scopes.push({ scope: scope, requireCalls: [node] });
          scopeIndex += 1;
        }
      }
    },
    'Program:exit': function ProgramExit() {
      scopes.forEach(function (_ref) {
        var scope = _ref.scope;
        var requireCalls = _ref.requireCalls;

        requireCalls.forEach(function (node, index) {
          var scopeBody = getScopeBody(scope);
          var nodePosition = findNodeIndexInScopeBody(scope, node);
          var statementWithRequireCall = scopeBody[nodePosition];
          var nextStatement = scopeBody[nodePosition + 1];
          var nextRequireCall = requireCalls[index + 1];

          if (nextRequireCall && containsNodeOrEqual(statementWithRequireCall, nextRequireCall)) {
            return;
          }

          if (nextStatement && (!nextRequireCall || !containsNodeOrEqual(nextStatement, nextRequireCall))) {

            checkForNewLine(statementWithRequireCall, nextStatement, 'require');
          }
        });
      });
    }
  };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJ1bGVzL25ld2xpbmUtYWZ0ZXItaW1wb3J0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBS0E7Ozs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7O0FBTUEsU0FBUyxtQkFBVCxDQUE2QixTQUE3QixFQUF3QyxTQUF4QyxFQUFtRDtBQUMvQyxTQUFPLFVBQVUsS0FBVixDQUFnQixDQUFoQixLQUFzQixVQUFVLEtBQVYsQ0FBZ0IsQ0FBaEIsQ0FBdEIsSUFBNEMsVUFBVSxLQUFWLENBQWdCLENBQWhCLEtBQXNCLFVBQVUsS0FBVixDQUFnQixDQUFoQixDQUF0QixDQURKO0NBQW5EOztBQUlBLFNBQVMsWUFBVCxDQUFzQixLQUF0QixFQUE2QjtNQUNqQixPQUFTLE1BQU0sS0FBTixDQUFULEtBRGlCOzs7QUFHekIsTUFBSSxLQUFLLElBQUwsS0FBYyxnQkFBZCxFQUFnQztBQUNoQyxXQUFPLEtBQUssSUFBTCxDQUR5QjtHQUFwQzs7QUFJQSxTQUFPLElBQVAsQ0FQeUI7Q0FBN0I7O0FBVUEsU0FBUyx3QkFBVCxDQUFrQyxLQUFsQyxFQUF5QyxVQUF6QyxFQUFxRDtBQUNqRCxNQUFNLE9BQU8sYUFBYSxLQUFiLENBQVAsQ0FEMkM7O0FBR2pELFNBQU8sc0JBQVUsSUFBVixFQUFnQixVQUFDLElBQUQ7V0FBVSxvQkFBb0IsSUFBcEIsRUFBMEIsVUFBMUI7R0FBVixDQUF2QixDQUhpRDtDQUFyRDs7QUFNQSxTQUFTLGlCQUFULENBQTJCLElBQTNCLEVBQWlDLFFBQWpDLEVBQTJDO0FBQ3pDLFNBQU8sU0FBUyxHQUFULENBQWEsS0FBYixDQUFtQixJQUFuQixHQUEwQixLQUFLLEdBQUwsQ0FBUyxHQUFULENBQWEsSUFBYixDQURRO0NBQTNDOztBQUtBLE9BQU8sT0FBUCxHQUFpQixVQUFVLE9BQVYsRUFBbUI7QUFDbEMsTUFBTSxTQUFTLEVBQVQsQ0FENEI7QUFFbEMsTUFBSSxhQUFhLENBQWIsQ0FGOEI7O0FBSWxDLFdBQVMsZUFBVCxDQUF5QixJQUF6QixFQUErQixRQUEvQixFQUF5QyxJQUF6QyxFQUErQztBQUM3QyxRQUFJLGtCQUFrQixJQUFsQixFQUF3QixRQUF4QixJQUFvQyxDQUFwQyxFQUF1QztBQUN6QyxVQUFJLFNBQVMsS0FBSyxHQUFMLENBQVMsS0FBVCxDQUFlLE1BQWYsQ0FENEI7O0FBR3pDLFVBQUksS0FBSyxHQUFMLENBQVMsS0FBVCxDQUFlLElBQWYsS0FBd0IsS0FBSyxHQUFMLENBQVMsR0FBVCxDQUFhLElBQWIsRUFBbUI7QUFDN0MsaUJBQVMsQ0FBVCxDQUQ2QztPQUEvQzs7QUFJQSxjQUFRLE1BQVIsQ0FBZTtBQUNiLGFBQUs7QUFDSCxnQkFBTSxLQUFLLEdBQUwsQ0FBUyxHQUFULENBQWEsSUFBYjtBQUNOLHdCQUZHO1NBQUw7QUFJQSxnREFBc0MsK0NBQTBDLFVBQWhGO09BTEYsRUFQeUM7S0FBM0M7R0FERjs7QUFrQkEsU0FBTztBQUNMLHVCQUFtQiwyQkFBVSxJQUFWLEVBQWdCO1VBQ3pCLFNBQVcsS0FBWCxPQUR5Qjs7QUFFakMsVUFBTSxlQUFlLE9BQU8sSUFBUCxDQUFZLE9BQVosQ0FBb0IsSUFBcEIsQ0FBZixDQUYyQjtBQUdqQyxVQUFNLFdBQVcsT0FBTyxJQUFQLENBQVksZUFBZSxDQUFmLENBQXZCLENBSDJCOztBQUtqQyxVQUFJLFlBQVksU0FBUyxJQUFULEtBQWtCLG1CQUFsQixFQUF1QztBQUNyRCx3QkFBZ0IsSUFBaEIsRUFBc0IsUUFBdEIsRUFBZ0MsUUFBaEMsRUFEcUQ7T0FBdkQ7S0FMaUI7QUFTbkIsYUFBUyxtQkFBWTtBQUNuQixhQUFPLElBQVAsQ0FBWSxFQUFFLE9BQU8sUUFBUSxRQUFSLEVBQVAsRUFBMkIsY0FBYyxFQUFkLEVBQXpDLEVBRG1CO0tBQVo7QUFHVCxvQkFBZ0Isd0JBQVMsSUFBVCxFQUFlO0FBQzdCLFVBQU0sUUFBUSxRQUFRLFFBQVIsRUFBUixDQUR1QjtBQUU3QixVQUFJLDZCQUFnQixJQUFoQixDQUFKLEVBQTJCO0FBQ3pCLFlBQU0sZUFBZSxPQUFPLFVBQVAsQ0FBZixDQURtQjs7QUFHekIsWUFBSSxVQUFVLGFBQWEsS0FBYixFQUFvQjtBQUNoQyx1QkFBYSxZQUFiLENBQTBCLElBQTFCLENBQStCLElBQS9CLEVBRGdDO1NBQWxDLE1BRU87QUFDTCxpQkFBTyxJQUFQLENBQVksRUFBRSxZQUFGLEVBQVMsY0FBYyxDQUFFLElBQUYsQ0FBZCxFQUFyQixFQURLO0FBRUwsd0JBQWMsQ0FBZCxDQUZLO1NBRlA7T0FIRjtLQUZjO0FBYWhCLG9CQUFnQix1QkFBWTtBQUMxQixhQUFPLE9BQVAsQ0FBZSxnQkFBbUM7WUFBdkIsbUJBQXVCO1lBQWhCLGlDQUFnQjs7QUFDaEQscUJBQWEsT0FBYixDQUFxQixVQUFVLElBQVYsRUFBZ0IsS0FBaEIsRUFBdUI7QUFDMUMsY0FBTSxZQUFZLGFBQWEsS0FBYixDQUFaLENBRG9DO0FBRTFDLGNBQU0sZUFBZSx5QkFBeUIsS0FBekIsRUFBZ0MsSUFBaEMsQ0FBZixDQUZvQztBQUcxQyxjQUFNLDJCQUEyQixVQUFVLFlBQVYsQ0FBM0IsQ0FIb0M7QUFJMUMsY0FBTSxnQkFBZ0IsVUFBVSxlQUFlLENBQWYsQ0FBMUIsQ0FKb0M7QUFLMUMsY0FBTSxrQkFBa0IsYUFBYSxRQUFRLENBQVIsQ0FBL0IsQ0FMb0M7O0FBTzFDLGNBQUksbUJBQW1CLG9CQUFvQix3QkFBcEIsRUFBOEMsZUFBOUMsQ0FBbkIsRUFBbUY7QUFDckYsbUJBRHFGO1dBQXZGOztBQUlBLGNBQUksa0JBQ0EsQ0FBQyxlQUFELElBQW9CLENBQUMsb0JBQW9CLGFBQXBCLEVBQW1DLGVBQW5DLENBQUQsQ0FEcEIsRUFDMkU7O0FBRTdFLDRCQUFnQix3QkFBaEIsRUFBMEMsYUFBMUMsRUFBeUQsU0FBekQsRUFGNkU7V0FEL0U7U0FYbUIsQ0FBckIsQ0FEZ0Q7T0FBbkMsQ0FBZixDQUQwQjtLQUFaO0dBMUJsQixDQXRCa0M7Q0FBbkIiLCJmaWxlIjoicnVsZXMvbmV3bGluZS1hZnRlci1pbXBvcnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBmaWxlb3ZlcnZpZXcgUnVsZSB0byBlbmZvcmNlIG5ldyBsaW5lIGFmdGVyIGltcG9ydCBub3QgZm9sbG93ZWQgYnkgYW5vdGhlciBpbXBvcnQuXG4gKiBAYXV0aG9yIFJhZGVrIEJlbmtlbFxuICovXG5cbmltcG9ydCBpc1N0YXRpY1JlcXVpcmUgZnJvbSAnLi4vY29yZS9zdGF0aWNSZXF1aXJlJ1xuaW1wb3J0IGZpbmRJbmRleCBmcm9tICdsb2Rhc2guZmluZGluZGV4J1xuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUnVsZSBEZWZpbml0aW9uXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5mdW5jdGlvbiBjb250YWluc05vZGVPckVxdWFsKG91dGVyTm9kZSwgaW5uZXJOb2RlKSB7XG4gICAgcmV0dXJuIG91dGVyTm9kZS5yYW5nZVswXSA8PSBpbm5lck5vZGUucmFuZ2VbMF0gJiYgb3V0ZXJOb2RlLnJhbmdlWzFdID49IGlubmVyTm9kZS5yYW5nZVsxXVxufVxuXG5mdW5jdGlvbiBnZXRTY29wZUJvZHkoc2NvcGUpIHtcbiAgICBjb25zdCB7IGJvZHkgfSA9IHNjb3BlLmJsb2NrXG5cbiAgICBpZiAoYm9keS50eXBlID09PSAnQmxvY2tTdGF0ZW1lbnQnKSB7XG4gICAgICAgIHJldHVybiBib2R5LmJvZHlcbiAgICB9XG5cbiAgICByZXR1cm4gYm9keVxufVxuXG5mdW5jdGlvbiBmaW5kTm9kZUluZGV4SW5TY29wZUJvZHkoc2NvcGUsIG5vZGVUb0ZpbmQpIHtcbiAgICBjb25zdCBib2R5ID0gZ2V0U2NvcGVCb2R5KHNjb3BlKVxuXG4gICAgcmV0dXJuIGZpbmRJbmRleChib2R5LCAobm9kZSkgPT4gY29udGFpbnNOb2RlT3JFcXVhbChub2RlLCBub2RlVG9GaW5kKSlcbn1cblxuZnVuY3Rpb24gZ2V0TGluZURpZmZlcmVuY2Uobm9kZSwgbmV4dE5vZGUpIHtcbiAgcmV0dXJuIG5leHROb2RlLmxvYy5zdGFydC5saW5lIC0gbm9kZS5sb2MuZW5kLmxpbmVcbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChjb250ZXh0KSB7XG4gIGNvbnN0IHNjb3BlcyA9IFtdXG4gIGxldCBzY29wZUluZGV4ID0gMFxuXG4gIGZ1bmN0aW9uIGNoZWNrRm9yTmV3TGluZShub2RlLCBuZXh0Tm9kZSwgdHlwZSkge1xuICAgIGlmIChnZXRMaW5lRGlmZmVyZW5jZShub2RlLCBuZXh0Tm9kZSkgPCAyKSB7XG4gICAgICBsZXQgY29sdW1uID0gbm9kZS5sb2Muc3RhcnQuY29sdW1uXG5cbiAgICAgIGlmIChub2RlLmxvYy5zdGFydC5saW5lICE9PSBub2RlLmxvYy5lbmQubGluZSkge1xuICAgICAgICBjb2x1bW4gPSAwXG4gICAgICB9XG5cbiAgICAgIGNvbnRleHQucmVwb3J0KHtcbiAgICAgICAgbG9jOiB7XG4gICAgICAgICAgbGluZTogbm9kZS5sb2MuZW5kLmxpbmUsXG4gICAgICAgICAgY29sdW1uLFxuICAgICAgICB9LFxuICAgICAgICBtZXNzYWdlOiBgRXhwZWN0ZWQgZW1wdHkgbGluZSBhZnRlciAke3R5cGV9IHN0YXRlbWVudCBub3QgZm9sbG93ZWQgYnkgYW5vdGhlciAke3R5cGV9LmAsXG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgSW1wb3J0RGVjbGFyYXRpb246IGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICBjb25zdCB7IHBhcmVudCB9ID0gbm9kZVxuICAgICAgY29uc3Qgbm9kZVBvc2l0aW9uID0gcGFyZW50LmJvZHkuaW5kZXhPZihub2RlKVxuICAgICAgY29uc3QgbmV4dE5vZGUgPSBwYXJlbnQuYm9keVtub2RlUG9zaXRpb24gKyAxXVxuXG4gICAgICBpZiAobmV4dE5vZGUgJiYgbmV4dE5vZGUudHlwZSAhPT0gJ0ltcG9ydERlY2xhcmF0aW9uJykge1xuICAgICAgICBjaGVja0Zvck5ld0xpbmUobm9kZSwgbmV4dE5vZGUsICdpbXBvcnQnKVxuICAgICAgfVxuICAgIH0sXG4gICAgUHJvZ3JhbTogZnVuY3Rpb24gKCkge1xuICAgICAgc2NvcGVzLnB1c2goeyBzY29wZTogY29udGV4dC5nZXRTY29wZSgpLCByZXF1aXJlQ2FsbHM6IFtdIH0pXG4gICAgfSxcbiAgICBDYWxsRXhwcmVzc2lvbjogZnVuY3Rpb24obm9kZSkge1xuICAgICAgY29uc3Qgc2NvcGUgPSBjb250ZXh0LmdldFNjb3BlKClcbiAgICAgIGlmIChpc1N0YXRpY1JlcXVpcmUobm9kZSkpIHtcbiAgICAgICAgY29uc3QgY3VycmVudFNjb3BlID0gc2NvcGVzW3Njb3BlSW5kZXhdXG5cbiAgICAgICAgaWYgKHNjb3BlID09PSBjdXJyZW50U2NvcGUuc2NvcGUpIHtcbiAgICAgICAgICBjdXJyZW50U2NvcGUucmVxdWlyZUNhbGxzLnB1c2gobm9kZSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzY29wZXMucHVzaCh7IHNjb3BlLCByZXF1aXJlQ2FsbHM6IFsgbm9kZSBdIH0pXG4gICAgICAgICAgc2NvcGVJbmRleCArPSAxXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgICdQcm9ncmFtOmV4aXQnOiBmdW5jdGlvbiAoKSB7XG4gICAgICBzY29wZXMuZm9yRWFjaChmdW5jdGlvbiAoeyBzY29wZSwgcmVxdWlyZUNhbGxzIH0pIHtcbiAgICAgICAgcmVxdWlyZUNhbGxzLmZvckVhY2goZnVuY3Rpb24gKG5vZGUsIGluZGV4KSB7XG4gICAgICAgICAgY29uc3Qgc2NvcGVCb2R5ID0gZ2V0U2NvcGVCb2R5KHNjb3BlKVxuICAgICAgICAgIGNvbnN0IG5vZGVQb3NpdGlvbiA9IGZpbmROb2RlSW5kZXhJblNjb3BlQm9keShzY29wZSwgbm9kZSlcbiAgICAgICAgICBjb25zdCBzdGF0ZW1lbnRXaXRoUmVxdWlyZUNhbGwgPSBzY29wZUJvZHlbbm9kZVBvc2l0aW9uXVxuICAgICAgICAgIGNvbnN0IG5leHRTdGF0ZW1lbnQgPSBzY29wZUJvZHlbbm9kZVBvc2l0aW9uICsgMV1cbiAgICAgICAgICBjb25zdCBuZXh0UmVxdWlyZUNhbGwgPSByZXF1aXJlQ2FsbHNbaW5kZXggKyAxXVxuXG4gICAgICAgICAgaWYgKG5leHRSZXF1aXJlQ2FsbCAmJiBjb250YWluc05vZGVPckVxdWFsKHN0YXRlbWVudFdpdGhSZXF1aXJlQ2FsbCwgbmV4dFJlcXVpcmVDYWxsKSkge1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKG5leHRTdGF0ZW1lbnQgJiZcbiAgICAgICAgICAgICAoIW5leHRSZXF1aXJlQ2FsbCB8fCAhY29udGFpbnNOb2RlT3JFcXVhbChuZXh0U3RhdGVtZW50LCBuZXh0UmVxdWlyZUNhbGwpKSkge1xuXG4gICAgICAgICAgICBjaGVja0Zvck5ld0xpbmUoc3RhdGVtZW50V2l0aFJlcXVpcmVDYWxsLCBuZXh0U3RhdGVtZW50LCAncmVxdWlyZScpXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9LFxuICB9XG59XG4iXX0=