import assert from 'node:assert/strict';
import test from 'node:test';
import sourcePublications from '../src/data/publications_research_data.json' with { type: 'json' };
import { publications } from '../src/data/content.js';

test('research publications use exactly the 42 JSON entries newest first', () => {
  assert.equal(sourcePublications.length, 42);
  assert.equal(publications.length, 42);
  assert.equal(publications.every(publication => publication.summary && !publication.summary.startsWith(publication.title)), true);
  assert.equal(publications.every(publication => Array.isArray(publication.keywords) && publication.keywords.length >= 3 && publication.keywords.length <= 4), true);

  const unsortedIndex = publications.findIndex((publication, index, list) => {
    if (index === 0) return false;
    const previous = list[index - 1];
    if (previous.year !== publication.year) return previous.year < publication.year;
    return (previous.month || 0) < (publication.month || 0);
  });

  assert.equal(unsortedIndex, -1);
  assert.equal(publications[0].year, 2026);
  assert.equal(publications.at(-1).year, 2012);

  assert.equal(publications.filter(publication => publication.hasArticleLink).length, 41);
  assert.equal(publications.filter(publication => !publication.hasArticleLink).length, 1);
  assert.equal(
    publications.some(publication => publication.title === 'Efficacy of Tamsulosin Versus silodosin in Patients with Lower Ureteric Calculi'),
    true
  );
});
