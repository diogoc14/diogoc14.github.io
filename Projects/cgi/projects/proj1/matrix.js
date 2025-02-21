/**
 * Daniel Ramos, N.62396
 * Diogo Carvalho, N.62418
 */
import {mat3} from "../../libs/MV.js";

//Barnsley fern

const barnsley_nfunctions = 4.0;

const barnsley_prob = [0.01, 0.86, 0.93, 1.0];

const barnsley_f1 = mat3(
    0.0, 0.0, 0.0,
    0.0, 0.16, 0.0,
    0.0, 0.0, 1.0
);

const barnsley_f2 = mat3(
    0.85, 0.04, 0.0,
    -0.04, 0.85, 1.6,
    0.0, 0.0, 1.0
);

const barnsley_f3 = mat3(
    0.2, -0.26, 0.0,
    0.23, 0.22, 1.6,
    0.0, 0.0, 1.0
);

const barnsley_f4 = mat3(
    -0.15, 0.28, 0.0,
    0.26, 0.24, 0.44,
    0.0, 0.0, 1.0
);

const barnsley_functions = [barnsley_f1, barnsley_f2, barnsley_f3, barnsley_f4];

const barnsley_pos = {
    "x" : 0.000,
    "y" : 5.00,
    "scale" : 5.50
}


//Culcita fern

const culcita_nfunctions = 4.0;

const culcita_prob =  [0.02, 0.86, 0.93, 1.0];

const culcita_f1 = mat3(
    0.0, 0.0, 0.0,
    0.0, 0.25, -0.14,
    0.0, 0.0, 0.02
);

const culcita_f2 = mat3(
    0.85, 0.002, 0.0,
    -0.02, 0.83, 1.0,
    0.0, 0.0, 1.0
);

const culcita_f3 = mat3(
    0.09, -0.28, 0.0,
    0.3, 0.11, 0.6,
    0.0, 0.0, 1.0
);

const culcita_f4 = mat3(
    -0.09, 0.28, 0.0,
    0.3, 0.09, 0.7,
    0.0, 0.0, 1.0
);

const culcita_functions = [culcita_f1, culcita_f2, culcita_f3, culcita_f4];

const culcita_pos = {
    "x" : 0.10,
    "y" : 2.87,
    "scale" : 3.10
}

//Cyclosorus fern

const cyclosorus_nfunctions = 4.0;

const cyclosorus_prob = [0.02, 0.86, 0.93, 1.0];

const cyclosorus_f1 = mat3(
    0.0, 0.0, 0.0,
    0.0, 0.25, -0.4,
    0.0, 0.0, 1.0
);

const cyclosorus_f2 = mat3(
    0.95, 0.005, -0.002,
    -0.005, 0.93, 0.5,
    -0.002, 0.5, 1.0
);

const cyclosorus_f3 = mat3(
    0.035, -0.2, -0.09,
    0.16, 0.04, 0.02,
    0.0, 0.0, 1.0
);

const cyclosorus_f4 = mat3(
    -0.04, 0.2, 0.083,
    0.16, 0.04, 0.12,
    0.0, 0.0, 1.0
);

const cyclosorus_functions = [cyclosorus_f1, cyclosorus_f2, cyclosorus_f3, cyclosorus_f4];

const cyclosorus_pos = {
    "x" : 0.21,
    "y" : 3.20,
    "scale" : 4.00
}


//Fishbone fern

const fishbone_nfunctions = 4.0;

const fishbone_prob = [0.02, 0.86, 0.93, 1.0];

const fishbone_f1 = mat3(
    0.0, 0.0, 0.0,
    0.0, 0.25, -0.4,
    0.0, 0.0, 1.0
);

const fishbone_f2 = mat3(
    0.95, 0.002, -0.002,
    -0.005, 0.93, 0.5,
    0.0, 0.0, 1.0
);

const fishbone_f3 = mat3(
    0.035, -0.11, -0.05,
    0.27, 0.01, 0.005,
    0.0, 0.0, 1.0
);

const fishbone_f4 = mat3(
    -0.04, 0.11, 0.047,
    0.27, 0.01, 0.06,
    0.0, 0.0, 1.0
);

const fishbone_functions = [fishbone_f1, fishbone_f2, fishbone_f3, fishbone_f4];

const fishbone_pos = {
    "x" : 0.21,
    "y" : 3.20,
    "scale" : 4.00
}

//spiral

const spiral_nfunctions = 3.0;

const spiral_prob = [0.9, 0.95, 1.0];

const spiral_f1 = mat3(
    0.787879, -0.424242, 1.758647,
    0.242424, 0.859848, 1.408065,
    0.0, 0.0, 1.0
);

const spiral_f2 = mat3(
    -0.121212, 0.257576, -6.721654,
    0.151515, 0.053030, 1.377236,
    0.0, 0.0, 1.0
);

const spiral_f3 = mat3(
    0.181818, -0.136364, 6.086107,
    0.090909, 0.181818, 1.568035,
    0.0, 0.0, 1.0
);

const spiral_functions = [spiral_f1, spiral_f2, spiral_f3];

const spiral_pos = {
    "x" : -0.104,
    "y" : 5.000,
    "scale" : 5.00
}

const mandelbrot_nfunctions = 2.0;

const mandelbrot_prob = [0.5, 1.0];

const mandelbrot_f1 = mat3(
    0.2020, -0.8050, -0.3730,
    -0.6890, -0.3420, -0.6530,
    0.0, 0.0, 1.0
);

const mandelbrot_f2 = mat3(
    0.1380, 0.6650, 0.6600,
    -0.5020, -0.2220, -0.2770,
    0.0, 0.0, 1.0
);

const mandelbrot_functions = [mandelbrot_f1, mandelbrot_f2];

const mandelbrot_pos = {
    "x" : 0.18,
    "y" : -0.474,
    "scale" : 0.60
}

const tree1_nfunctions = 7.0;

const tree1_prob = [1.0/7.0, 2.0/7.0, 3.0/7.0, 4.0/7.0, 5.0/7.0, 6.0/7.0, 1.0];

const tree1_f1 = mat3(
    0.05, 0.0, -0.06,
    0.0, 0.4, -0.47,
    0.0, 0.0, 1.0
);

const tree1_f2 = mat3(
    -0.05, 0.0, -0.06,
    0.0, -0.4, -0.47,
    0.0, 0.0, 1.0
);

const tree1_f3 = mat3(
    0.03, -0.14, -0.16,
    0.0, 0.26, -0.01,
    0.0, 0.0, 1.0
);

const tree1_f4 = mat3(
    -0.03, 0.14, -0.16,
    0.0, -0.26, -0.01,
    0.0, 0.0, 1.0
);

const tree1_f5 = mat3(
    0.56, 0.44, 0.3,
    -0.37, 0.51, 0.15,
    0.0, 0.0, 1.0
);

const tree1_f6 = mat3(
    0.19, 0.07, -0.2,
    -0.1, 0.15, 0.28,
    0.0, 0.0, 1.0
);

const tree1_f7 = mat3(
    -0.33, -0.34, -0.54,
    -0.33, 0.34, 0.39,
    0.0, 0.0, 1.0
);

const tree1_functions = [tree1_f1, tree1_f2, tree1_f3, tree1_f4, tree1_f5, tree1_f6, tree1_f7];

const tree1_pos = {
    "x" : 0.0,
    "y" : 0.04,
    "scale" : 1.00
}


const tree2_nfunctions = 4.0;

const tree2_prob = [0.25, 0.50, 0.75, 1.0];

const tree2_f1 = mat3(
    0.01, 0.0, 0.0,
    0.0, 0.45, 0.0,
    0.0, 0.0, 1.0
);

const tree2_f2 = mat3(
    -0.01, 0.0, 0.0,
    0.0, -0.45, 0.4,
    0.0, 0.0, 1.0
);

const tree2_f3 = mat3(
    0.42, -0.42, 0.0,
    0.42, 0.42, 0.4,
    0.0, 0.0, 1.0
);

const tree2_f4 = mat3(
    0.42, 0.42, 0.0,
    -0.42, 0.42, 0.4,
    0.0, 0.0, 1.0
);

const tree2_functions = [tree2_f1, tree2_f2, tree2_f3, tree2_f4];

const tree2_pos = {
    "x" : 0.01,
    "y" : 0.45,
    "scale" : 0.50
}

const dragon_nfunctions = 2.0;

const dragon_prob = [0.8, 1.0];

const dragon_f1 = mat3(
    0.824074, 0.281428, -1.882290,
    -0.212346, 0.864198, -0.110607,
    0.0, 0.0, 1.0
);

const dragon_f2 = mat3(
    0.088272, 0.520988, 0.785360,
    -0.463889, -0.377778, 8.095795,
    0.0, 0.0, 1.0
);

const dragon_functions = [dragon_f1, dragon_f2];

const dragon_pos = {
    "x" : -0.04,
    "y" : 4.73,
    "scale" : 5.50
}

const maple_nfunctions = 4.0;

const maple_prob = [0.25, 0.50, 0.75, 1.0];

const maple_f1 = mat3(
    0.14, 0.01, -0.08,
    0.0, 0.51, -1.31,
    0.0, 0.0, 1.0
);

const maple_f2 = mat3(
    0.43, 0.52, 1.49,
    -0.45, 0.5, -0.75,
    0.0, 0.0, 1.0
);

const maple_f3 = mat3(
    0.45, -0.49, -1.62,
    0.47, 0.47, -0.74,
    0.0, 0.0, 1.0
);

const maple_f4 = mat3(
    0.49, 0.0, 0.02,
    0.0, 0.51, 1.62,
    0.0, 0.0, 1.0
);

const maple_functions = [maple_f1, maple_f2, maple_f3, maple_f4];

const maple_pos = {
    "x" : 0.02,
    "y" : 0.09,
    "scale" : 4.00
}

export const nfunctionsSet = {
    1: barnsley_nfunctions,
    2: culcita_nfunctions,
    3: cyclosorus_nfunctions,
    4: fishbone_nfunctions,
    5: spiral_nfunctions,
    6: mandelbrot_nfunctions,
    7: tree1_nfunctions,
    8: tree2_nfunctions,
    9: dragon_nfunctions,
    0: maple_nfunctions
  };

  export const functionsSet = {
    1: barnsley_functions,
    2: culcita_functions,
    3: cyclosorus_functions,
    4: fishbone_functions,
    5: spiral_functions,
    6: mandelbrot_functions,
    7: tree1_functions,
    8: tree2_functions,
    9: dragon_functions,
    0: maple_functions
  }

  export const probSet = {
    1: barnsley_prob,
    2: culcita_prob,
    3: cyclosorus_prob,
    4: fishbone_prob,
    5: spiral_prob,
    6: mandelbrot_prob,
    7: tree1_prob,
    8: tree2_prob,
    9: dragon_prob,
    0: maple_prob
  }

  export const posSet = {
    1: barnsley_pos,
    2: culcita_pos,
    3: cyclosorus_pos,
    4: fishbone_pos,
    5: spiral_pos,
    6: mandelbrot_pos,
    7: tree1_pos,
    8: tree2_pos,
    9: dragon_pos,
    0: maple_pos
  }
