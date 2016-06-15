// TheSpanishInquisition

// Cache the matrix. Note this implementation is limited to
// strings of 64 char or less. This could be altered to update
// dynamically, or a larger value could be used.

// TODO: grok it.
// The matrix was cached, as above comment states, but it was throwing unpredictable results sometimes. Either there was a bug or I was using it wrong. Now matrix is recreated on each call and results are correct. This probabily hits performance.

module.exports = function(__this, that, limit) {
  var matrix = [];
  for (var i = 0; i < 64; i++) {
    matrix[i] = [i];
    matrix[i].length = 64;
  }
  for (var i = 0; i < 64; i++) {
    matrix[0][i] = i;
  }

  var thisLength = __this.length,
      thatLength = that.length;

  prepare = function (steps) {
    distance            = {};
    distance.steps      = steps;
    distance.relative   = steps / Math.max(thisLength, thatLength);
    distance.similarity = 1 - distance.relative;

    return distance;
  }

  if (Math.abs(thisLength - thatLength) > (limit || 32)) return prepare (limit || 32);
  if (thisLength === 0) return prepare (thatLength);
  if (thatLength === 0) return prepare (thisLength);

  // Calculate matrix.
  var this_i, that_j, cost, min, t;
  for (i = 1; i <= thisLength; ++i) {
    this_i = __this[i-1];

    // Step 4
    for (j = 1; j <= thatLength; ++j) {
      // Check the jagged ld total so far
      if (i === j && matrix[i][j] > 4) return prepare (thisLength);

      that_j = that[j-1];
      cost = (this_i === that_j) ? 0 : 1; // Step 5
      // Calculate the minimum (much faster than Math.min(...)).
      min    = matrix[i - 1][j    ] + 1;                                              // Deletion.
      if ((t = matrix[i    ][j - 1] + 1   ) < min) min = t;   // Insertion.
      if ((t = matrix[i - 1][j - 1] + cost) < min) min = t;   // Substitution.

      // Update matrix.
      matrix[i][j] = (i > 1 && j > 1 && this_i === that[j-2] && this[i-2] === that_j && (t = matrix[i-2][j-2]+cost) < min) ? t : min; // Transposition.
    }
  }

  return prepare (matrix[thisLength][thatLength])

};