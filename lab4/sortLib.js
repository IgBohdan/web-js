const SORT = {
  // Створення лічильника операцій
  createCounter() {
    return {
      comparisons: 0,
      swaps: 0,
      log() {
        console.log(
          `Comparisons: ${this.comparisons}, Swaps/Moves: ${this.swaps}`
        );
      },
    };
  },

  // Обробка розріджених масивів
  handleSparseArrays(arr) {
    let hasUndefined = false;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === undefined) {
        arr[i] = null;
        hasUndefined = true;
      }
    }
    if (hasUndefined) {
      console.log(
        "Warning: Sparse array detected. Undefined elements were replaced with null"
      );
    }
    return arr;
  },

  // Сортування обміном (Bubble Sort)
  swapSort(arr, ascending = true) {
    const counter = SORT.createCounter();
    const workingArr = SORT.handleSparseArrays([...arr]);

    for (let i = 0; i < workingArr.length - 1; i++) {
      for (let j = 0; j < workingArr.length - 1 - i; j++) {
        counter.comparisons++;
        const shouldSwap = ascending
          ? workingArr[j] > workingArr[j + 1]
          : workingArr[j] < workingArr[j + 1];
        if (shouldSwap) {
          [workingArr[j], workingArr[j + 1]] = [
            workingArr[j + 1],
            workingArr[j],
          ];
          counter.swaps++;
        }
      }
    }
    counter.log();
    return workingArr;
  },

  // Сортування мінімальних елементів (Selection Sort)
  selectionSort(arr, ascending = true) {
    const counter = SORT.createCounter();
    const workingArr = SORT.handleSparseArrays([...arr]);

    for (let i = 0; i < workingArr.length - 1; i++) {
      let minIdx = i;
      for (let j = i + 1; j < workingArr.length; j++) {
        counter.comparisons++;
        const shouldUpdate = ascending
          ? workingArr[j] < workingArr[minIdx]
          : workingArr[j] > workingArr[minIdx];
        if (shouldUpdate) {
          minIdx = j;
        }
      }
      if (minIdx !== i) {
        [workingArr[i], workingArr[minIdx]] = [
          workingArr[minIdx],
          workingArr[i],
        ];
        counter.swaps++;
      }
    }
    counter.log();
    return workingArr;
  },

  // Сортування вставками (Insertion Sort)
  insertionSort(arr, ascending = true) {
    const counter = SORT.createCounter();
    const workingArr = SORT.handleSparseArrays([...arr]);

    for (let i = 1; i < workingArr.length; i++) {
      const current = workingArr[i];
      let j = i - 1;
      while (j >= 0) {
        counter.comparisons++;
        const shouldMove = ascending
          ? workingArr[j] > current
          : workingArr[j] < current;
        if (shouldMove) {
          workingArr[j + 1] = workingArr[j];
          counter.swaps++;
          j--;
        } else break;
      }
      workingArr[j + 1] = current;
    }
    counter.log();
    return workingArr;
  },

  // Сортування Шелла (Shell Sort)
  shellSort(arr, ascending = true) {
    const counter = SORT.createCounter();
    const workingArr = SORT.handleSparseArrays([...arr]);

    const n = workingArr.length;
    for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
      for (let i = gap; i < n; i++) {
        const temp = workingArr[i];
        let j = i;
        while (j >= gap) {
          counter.comparisons++;
          const shouldMove = ascending
            ? workingArr[j - gap] > temp
            : workingArr[j - gap] < temp;
          if (shouldMove) {
            workingArr[j] = workingArr[j - gap];
            counter.swaps++;
            j -= gap;
          } else break;
        }
        workingArr[j] = temp;
      }
    }
    counter.log();
    return workingArr;
  },

  // Швидке сортування Хоара (Quick Sort)
  quickSort(arr, ascending = true) {
    const counter = SORT.createCounter();
    const workingArr = SORT.handleSparseArrays([...arr]);

    function partition(array, low, high) {
      const pivot = array[high];
      let i = low - 1;

      for (let j = low; j < high; j++) {
        counter.comparisons++;
        const shouldSwap = ascending ? array[j] <= pivot : array[j] >= pivot;
        if (shouldSwap) {
          i++;
          [array[i], array[j]] = [array[j], array[i]];
          counter.swaps++;
        }
      }
      [array[i + 1], array[high]] = [array[high], array[i + 1]];
      counter.swaps++;
      return i + 1;
    }

    function quickSortHelper(array, low, high) {
      if (low < high) {
        const pi = partition(array, low, high);
        quickSortHelper(array, low, pi - 1);
        quickSortHelper(array, pi + 1, high);
      }
    }

    quickSortHelper(workingArr, 0, workingArr.length - 1);
    counter.log();
    return workingArr;
  },
};

const regularArray = Array.from({ length: 100 }, () =>
  Math.floor(Math.random() * 1000)
);
const sparseArray = Array.from({ length: 100 }, () =>
  Math.random() > 0.2 ? Math.floor(Math.random() * 1000) : undefined
);

const methods = [
  ["Bubble Sort", SORT.swapSort],
  ["Selection Sort", SORT.selectionSort],
  ["Insertion Sort", SORT.insertionSort],
  ["Shell Sort", SORT.shellSort],
  ["Quick Sort", SORT.quickSort],
];

console.log("\n=== Звичайний масив (довжина: 100) ===");
methods.forEach(([name, method]) => {
  console.log(`\n${name}:`);
  const result = method(regularArray, true);
  console.log(`[${result}]`);
});

console.log("\n=== Розріджений масив (довжина: 100) ===");
methods.forEach(([name, method]) => {
  console.log(`\n${name}:`);
  const result = method(sparseArray, true);
  console.log(`[${result}]`);
});
