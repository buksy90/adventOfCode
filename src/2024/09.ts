type DiscItem = {
  id: number,
  value: number,
  blocksCount: number,
  isFile: boolean,
};
type Disc = Array<DiscItem>;


export function parseDisk(input: string): Disc {
  const visualized: Disc = [];

  let index = 0;
  let blockId = 0;
  for(const char of input) {
    const parsed = parseInt(char, 10);
    const isFile = index % 2 === 0;
    visualized.push({
      blocksCount: parsed,
      id: isFile ? blockId++ : -1,
      isFile,
      value: parsed,
    });

    index++;
  }

  return visualized;
}

function getLastFileIndex(disc: Disc): number {
  for(let i = disc.length-1; i > 0; i--) {
    if(disc[i].isFile) return i;
  }

  throw new Error('No files');
}

function pushFreeBlocks(disc: Disc, blocksCount: number): void {
  if(disc[disc.length-1].isFile) {
    disc.push({
      blocksCount: blocksCount,
      id: -1,
      isFile: false,
      value: -1
    });
  } else {
    disc[disc.length-1].blocksCount += blocksCount;
  }
}

export function moveDisc(disc: Disc): Disc {
  for(let i = 0; i < disc.length; i++) {
    if (i > 20000) {
      throw new Error('i over limit');
    }
    const item = disc[i];
    if (item.isFile === false && item.blocksCount > 0) {
      const toBeMovedIndex = getLastFileIndex(disc);
      const toBeMoved = disc[toBeMovedIndex];
      const blocksMoved = Math.min(item.blocksCount, toBeMoved.blocksCount);

      if(toBeMovedIndex <= i) {
        break;
      }
      if (blocksMoved === 0) {
        continue;
      }

      item.blocksCount -= blocksMoved;
      toBeMoved.blocksCount -= blocksMoved;

      if (toBeMoved.blocksCount <= 0) {
        disc.splice(toBeMovedIndex, 1);
      }

      disc.splice(i, 0, {
        ...toBeMoved,
        blocksCount: blocksMoved,
      });

      pushFreeBlocks(disc, blocksMoved);
      //console.log(strDisc(disc));
    }
  }

  return disc;
}

function findFreeSpaceIndex(disc: Disc, blocks: number): number {
  return disc.findIndex(i => i.isFile === false && i.blocksCount >= blocks);
}

function freeUpItemSpace(disc: Disc, position: number): void {
  const item = disc[position];
  disc.splice(position, 1);

  const itemNext = disc[position] as DiscItem | undefined;
  const itemBefore = disc[position - 1];
  if(itemBefore.isFile === false) {
    itemBefore.blocksCount += item.blocksCount;

    if (itemNext?.isFile === false) {
      itemBefore.blocksCount += itemNext.blocksCount;
      disc.splice(position, 1);
    }
    return;
  }

  if(itemNext?.isFile === false) {
    itemNext.blocksCount += item.blocksCount;
    return;
  }

  disc.splice(position, 0, {
    blocksCount: item.blocksCount,
    id: -1,
    isFile: false,
    value: -1,
  });
}

export function validateDisc(disc: Disc): void {
  for(let i = 1; i < disc.length; i++) {
    if (disc[i].isFile === false && disc[i-1].isFile === false) {
      debugger;
      throw new Error(`Two consecutive free blocks ${i-1} and ${i}`);
    }
  }
}

export function moveDisc2(disc: Disc): Disc {
  let iterations = 0;
  const movedIds = new Set<number>();
  for(let i = disc.length - 1; i >= 0; i--) {
    if(iterations++ > 30000) throw new Error('Too many iterations');

    const item = disc[i];
    if (item.isFile && movedIds.has(item.id) === false) {
      const freeIndex = findFreeSpaceIndex(disc, item.blocksCount);
      if (freeIndex >= 0 && freeIndex < i) {
        const freeItem = disc[freeIndex];
        freeItem.blocksCount -= item.blocksCount;

        freeUpItemSpace(disc, i);

        if (freeItem.blocksCount === 0) {
          disc.splice(freeIndex, 1);
        }
        disc.splice(freeIndex, 0, item);

        movedIds.add(item.id);
        
        //validateDisc(disc);

        // We moved item, update index accordingly
        //i++;
        //const nextIndexUpdated = disc.findIndex(v => v === nextItem);
        //i = nextIndexUpdated + 1;

        //console.log(strDisc(disc));
      }
    }
  }

  return disc;
}

export function hashDisc(disc: Disc): number {
  let sum = 0;
  let index = 0;
  for(const item of disc) {
    if (item.blocksCount > 0) {
      for(let i = 0; i < item.blocksCount; i++) {
        //console.log(`${index}*${item.id}`);
        if (item.isFile) {
          sum += item.id * index;
        }
        index++;
      }
    }
  }

  return sum;
}

export function strDisc(disc: Disc): string {
  let str = '';
  for(const item of disc) {
    for(let i = 0; i < item.blocksCount; i++)
      str += item.isFile ? item.id : '.';
  }

  return str;
}