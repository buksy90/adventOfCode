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

export function moveDisk(disc: Disc): Disc {
  for(let i = 0; i < disc.length; i++) {
    const item = disc[i];
    if (item.isFile === false) {
      const toBeMovedIndex = getLastFileIndex(disc);
      const toBeMoved = disc[toBeMovedIndex];
      const blocksMoved = Math.min(item.blocksCount, toBeMoved.blocksCount);

      item.blocksCount -= blocksMoved;
      toBeMoved.blocksCount -= blocksMoved;

      if (toBeMoved.blocksCount <= 0) {
        disc.splice(toBeMovedIndex, 1);
      }

      disc.splice(i+1, 0, {
        ...toBeMoved,
        blocksCount: blocksMoved,
      });

      pushFreeBlocks(disc, blocksMoved);
      console.log(strDisc(disc));
    }
  }

  return disc;
}

export function strDisc(disc: Disc): string {
  let str = '';
  for(const item of disc) {
    for(let i = 0; i < item.blocksCount; i++)
      str += item.isFile ? item.id : '.';
  }

  return str;
}