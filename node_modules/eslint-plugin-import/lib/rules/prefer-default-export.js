'use strict';

module.exports = function (context) {
  var specifierExportCount = 0;
  var hasDefaultExport = false;
  var hasStarExport = false;
  var namedExportNode = null;

  return {
    'ExportSpecifier': function ExportSpecifier(node) {
      if (node.exported.name === 'default') {
        hasDefaultExport = true;
      } else {
        specifierExportCount++;
        namedExportNode = node;
      }
    },

    'ExportNamedDeclaration': function ExportNamedDeclaration(node) {
      // if there are specifiers, node.declaration should be null
      if (!node.declaration) return;

      function captureDeclaration(identifierOrPattern) {
        if (identifierOrPattern.type === 'ObjectPattern') {
          // recursively capture
          identifierOrPattern.properties.forEach(function (property) {
            captureDeclaration(property.value);
          });
        } else {
          // assume it's a single standard identifier
          specifierExportCount++;
        }
      }

      if (node.declaration.declarations) {
        node.declaration.declarations.forEach(function (declaration) {
          captureDeclaration(declaration.id);
        });
      }

      namedExportNode = node;
    },

    'ExportDefaultDeclaration': function ExportDefaultDeclaration() {
      hasDefaultExport = true;
    },

    'ExportAllDeclaration': function ExportAllDeclaration() {
      hasStarExport = true;
    },

    'Program:exit': function ProgramExit() {
      if (specifierExportCount === 1 && !hasDefaultExport && !hasStarExport) {
        context.report(namedExportNode, 'Prefer default export.');
      }
    }
  };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJ1bGVzL3ByZWZlci1kZWZhdWx0LWV4cG9ydC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUFFQSxPQUFPLE9BQVAsR0FBaUIsVUFBUyxPQUFULEVBQWtCO0FBQ2pDLE1BQUksdUJBQXVCLENBQXZCLENBRDZCO0FBRWpDLE1BQUksbUJBQW1CLEtBQW5CLENBRjZCO0FBR2pDLE1BQUksZ0JBQWdCLEtBQWhCLENBSDZCO0FBSWpDLE1BQUksa0JBQWtCLElBQWxCLENBSjZCOztBQU1qQyxTQUFPO0FBQ0wsdUJBQW1CLHlCQUFTLElBQVQsRUFBZTtBQUNoQyxVQUFJLEtBQUssUUFBTCxDQUFjLElBQWQsS0FBdUIsU0FBdkIsRUFBa0M7QUFDcEMsMkJBQW1CLElBQW5CLENBRG9DO09BQXRDLE1BRU87QUFDTCwrQkFESztBQUVMLDBCQUFrQixJQUFsQixDQUZLO09BRlA7S0FEaUI7O0FBU25CLDhCQUEwQixnQ0FBUyxJQUFULEVBQWU7O0FBRXZDLFVBQUksQ0FBQyxLQUFLLFdBQUwsRUFBa0IsT0FBdkI7O0FBRUEsZUFBUyxrQkFBVCxDQUE0QixtQkFBNUIsRUFBaUQ7QUFDL0MsWUFBSSxvQkFBb0IsSUFBcEIsS0FBNkIsZUFBN0IsRUFBOEM7O0FBRWhELDhCQUFvQixVQUFwQixDQUNHLE9BREgsQ0FDVyxVQUFTLFFBQVQsRUFBbUI7QUFDMUIsK0JBQW1CLFNBQVMsS0FBVCxDQUFuQixDQUQwQjtXQUFuQixDQURYLENBRmdEO1NBQWxELE1BTU87O0FBRUwsaUNBRks7U0FOUDtPQURGOztBQWFBLFVBQUksS0FBSyxXQUFMLENBQWlCLFlBQWpCLEVBQStCO0FBQ2pDLGFBQUssV0FBTCxDQUFpQixZQUFqQixDQUE4QixPQUE5QixDQUFzQyxVQUFTLFdBQVQsRUFBc0I7QUFDMUQsNkJBQW1CLFlBQVksRUFBWixDQUFuQixDQUQwRDtTQUF0QixDQUF0QyxDQURpQztPQUFuQzs7QUFNQSx3QkFBa0IsSUFBbEIsQ0F2QnVDO0tBQWY7O0FBMEIxQixnQ0FBNEIsb0NBQVc7QUFDckMseUJBQW1CLElBQW5CLENBRHFDO0tBQVg7O0FBSTVCLDRCQUF3QixnQ0FBVztBQUNqQyxzQkFBZ0IsSUFBaEIsQ0FEaUM7S0FBWDs7QUFJeEIsb0JBQWdCLHVCQUFXO0FBQ3pCLFVBQUkseUJBQXlCLENBQXpCLElBQThCLENBQUMsZ0JBQUQsSUFBcUIsQ0FBQyxhQUFELEVBQWdCO0FBQ3JFLGdCQUFRLE1BQVIsQ0FBZSxlQUFmLEVBQWdDLHdCQUFoQyxFQURxRTtPQUF2RTtLQURjO0dBNUNsQixDQU5pQztDQUFsQiIsImZpbGUiOiJydWxlcy9wcmVmZXItZGVmYXVsdC1leHBvcnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCdcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihjb250ZXh0KSB7XG4gIGxldCBzcGVjaWZpZXJFeHBvcnRDb3VudCA9IDBcbiAgbGV0IGhhc0RlZmF1bHRFeHBvcnQgPSBmYWxzZVxuICBsZXQgaGFzU3RhckV4cG9ydCA9IGZhbHNlXG4gIGxldCBuYW1lZEV4cG9ydE5vZGUgPSBudWxsXG5cbiAgcmV0dXJuIHtcbiAgICAnRXhwb3J0U3BlY2lmaWVyJzogZnVuY3Rpb24obm9kZSkge1xuICAgICAgaWYgKG5vZGUuZXhwb3J0ZWQubmFtZSA9PT0gJ2RlZmF1bHQnKSB7XG4gICAgICAgIGhhc0RlZmF1bHRFeHBvcnQgPSB0cnVlXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzcGVjaWZpZXJFeHBvcnRDb3VudCsrXG4gICAgICAgIG5hbWVkRXhwb3J0Tm9kZSA9IG5vZGVcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgJ0V4cG9ydE5hbWVkRGVjbGFyYXRpb24nOiBmdW5jdGlvbihub2RlKSB7XG4gICAgICAvLyBpZiB0aGVyZSBhcmUgc3BlY2lmaWVycywgbm9kZS5kZWNsYXJhdGlvbiBzaG91bGQgYmUgbnVsbFxuICAgICAgaWYgKCFub2RlLmRlY2xhcmF0aW9uKSByZXR1cm5cblxuICAgICAgZnVuY3Rpb24gY2FwdHVyZURlY2xhcmF0aW9uKGlkZW50aWZpZXJPclBhdHRlcm4pIHtcbiAgICAgICAgaWYgKGlkZW50aWZpZXJPclBhdHRlcm4udHlwZSA9PT0gJ09iamVjdFBhdHRlcm4nKSB7XG4gICAgICAgICAgLy8gcmVjdXJzaXZlbHkgY2FwdHVyZVxuICAgICAgICAgIGlkZW50aWZpZXJPclBhdHRlcm4ucHJvcGVydGllc1xuICAgICAgICAgICAgLmZvckVhY2goZnVuY3Rpb24ocHJvcGVydHkpIHtcbiAgICAgICAgICAgICAgY2FwdHVyZURlY2xhcmF0aW9uKHByb3BlcnR5LnZhbHVlKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gYXNzdW1lIGl0J3MgYSBzaW5nbGUgc3RhbmRhcmQgaWRlbnRpZmllclxuICAgICAgICAgIHNwZWNpZmllckV4cG9ydENvdW50KytcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAobm9kZS5kZWNsYXJhdGlvbi5kZWNsYXJhdGlvbnMpIHtcbiAgICAgICAgbm9kZS5kZWNsYXJhdGlvbi5kZWNsYXJhdGlvbnMuZm9yRWFjaChmdW5jdGlvbihkZWNsYXJhdGlvbikge1xuICAgICAgICAgIGNhcHR1cmVEZWNsYXJhdGlvbihkZWNsYXJhdGlvbi5pZClcbiAgICAgICAgfSlcbiAgICAgIH1cblxuICAgICAgbmFtZWRFeHBvcnROb2RlID0gbm9kZVxuICAgIH0sXG5cbiAgICAnRXhwb3J0RGVmYXVsdERlY2xhcmF0aW9uJzogZnVuY3Rpb24oKSB7XG4gICAgICBoYXNEZWZhdWx0RXhwb3J0ID0gdHJ1ZVxuICAgIH0sXG5cbiAgICAnRXhwb3J0QWxsRGVjbGFyYXRpb24nOiBmdW5jdGlvbigpIHtcbiAgICAgIGhhc1N0YXJFeHBvcnQgPSB0cnVlXG4gICAgfSxcblxuICAgICdQcm9ncmFtOmV4aXQnOiBmdW5jdGlvbigpIHtcbiAgICAgIGlmIChzcGVjaWZpZXJFeHBvcnRDb3VudCA9PT0gMSAmJiAhaGFzRGVmYXVsdEV4cG9ydCAmJiAhaGFzU3RhckV4cG9ydCkge1xuICAgICAgICBjb250ZXh0LnJlcG9ydChuYW1lZEV4cG9ydE5vZGUsICdQcmVmZXIgZGVmYXVsdCBleHBvcnQuJylcbiAgICAgIH1cbiAgICB9LFxuICB9XG59XG4iXX0=